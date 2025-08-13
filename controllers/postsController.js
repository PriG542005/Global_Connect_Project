const { Post } = require('../models/Post');
const mongoose = require('mongoose');

const getPost = async (req, res) => {
    // Set up pagination variables with validation
    const page = Math.max(1, parseInt(req.query.page) || 1); // Ensure page is at least 1
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20)); // Limit between 1-50
    const skip = (page - 1) * limit;

    try {
        // Use Promise.all to run both queries concurrently for better performance
        const [posts, totalPosts] = await Promise.all([
            Post.find({})
                .populate('author', 'name avatar title') // Populate author details if needed
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(), // Use lean() for better performance if you don't need Mongoose document methods
            Post.countDocuments()
        ]);

        const totalPages = Math.ceil(totalPosts / limit);

        // Add additional metadata that might be useful
        res.status(200).json({
            posts,
            pagination: {
                currentPage: page,
                totalPages,
                totalPosts,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
                nextPage: page < totalPages ? page + 1 : null,
                prevPage: page > 1 ? page - 1 : null
            }
        });

    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({
            msg: "Failed to fetch posts",
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
}

const likePost = async (req, res) => {
    try {
        const { postId } = req.body;
        const userId = req.user.userId; // Corrected from req.user.id
        const userName = req.user.name;
        const userAvatar = req.user.avatar;
        const userTitle = req.user.title;

        // Check if the user has already liked the post by querying the database
        const existingLike = await Post.findOne({
            _id: postId,
            'likedby._id': new mongoose.Types.ObjectId(userId)
        });

        console.log(`Like/Unlike attempt for postId: ${postId}, userId: ${userId}`);
        console.log('Existing like found:', !!existingLike);

        if (existingLike) {
            // UNLIKE: Remove user from likedby array and decrement likes count
            const updatedPost = await Post.findByIdAndUpdate(
                postId,
                {
                    $pull: { likedby: { _id: new mongoose.Types.ObjectId(userId) } },
                    $inc: { likes: -1 }
                },
                { new: true }
            );
            console.log('Post after unlike:', updatedPost.likedby.map(l => l._id.toString()));
            res.status(200).json({ message: 'Post unliked successfully' });
        } else {
            // LIKE: Add user to likedby array (only if not already present) and increment likes count
            const updatedPost = await Post.findByIdAndUpdate(
                postId,
                {
                    $addToSet: {
                        likedby: {
                            _id: new mongoose.Types.ObjectId(userId),
                            name: userName,
                            avatar: userAvatar,
                            title: userTitle,
                        },
                    },
                    $inc: { likes: 1 }
                },
                { new: true }
            );
            console.log('Post after like:', updatedPost.likedby.map(l => l._id.toString()));
            res.status(200).json({ message: 'Post liked successfully' });
        }
    } catch (error) {
        console.error('Error in likePost controller:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const commentPost = async (req, res) => {
    try {
        const { postId, comment } = req.body;
        const userId = req.user.userId; // Corrected from req.user.id
        const userName = req.user.name;
        const userAvatar = req.user.avatar;
        const userTitle = req.user.title; // Assuming title is available in req.user

        if (!comment || comment.trim() === '') {
            return res.status(400).json({ message: 'Comment cannot be empty' });
        }

        const post = await Post.findById(postId);
        if (!post) {
            console.log(`Post not found for postId: ${postId}`);
            return res.status(404).json({ message: 'Post not found' });
        }
        console.log(`Post found for postId: ${postId}`);

        const newComment = {
            _id: new mongoose.Types.ObjectId(), // Generate unique ID for the comment
            userId: userId, // Store the user ID separately
            name: userName,
            comment: comment.trim(),
            time: new Date().toISOString(), // Store ISO string for consistent date handling
            avatar: userAvatar,
            title: userTitle, // Include title in comment if needed
        };



        post.commentsBy.push(newComment);
        post.comments += 1;
        await post.save();

        res.status(201).json({ message: 'Comment added successfully', comment: newComment });
    } catch (error) {
        console.error('Error in commentPost controller:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteComment = async (req, res) => {
    try {
        // Try to get parameters from both body and query
        const postId = req.body?.postId || req.query?.postId;
        const commentId = req.body?.commentId || req.query?.commentId;
        const userId = req.user.userId;





        if (!postId || !commentId) {
            return res.status(400).json({ message: 'Post ID and Comment ID are required' });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }





        // Find the comment and check if the user owns it
        const commentIndex = post.commentsBy.findIndex(comment =>
            comment._id.toString() === commentId.toString() && comment.userId.toString() === userId.toString()
        );

        if (commentIndex === -1) {
            return res.status(403).json({ message: 'Comment not found or you are not authorized to delete this comment' });
        }

        // Remove the comment
        post.commentsBy.splice(commentIndex, 1);
        post.comments = Math.max(0, post.comments - 1); // Ensure comments count doesn't go below 0
        await post.save();

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error in deleteComment controller:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const createPost = async (req, res) => {
    try {
        const { content, images } = req.body;
        const userId = req.user.userId;
        const userName = req.user.name;
        const userAvatar = req.user.avatar;
        const userTitle = req.user.title;

        if (!content || content.trim() === '') {
            return res.status(400).json({ message: 'Post content cannot be empty' });
        }

        // Validate images array (max 10 images)
        if (images && images.length > 10) {
            return res.status(400).json({ message: 'Maximum 10 images allowed per post' });
        }

        const newPost = new Post({
            author: {
                _id: userId,
                name: userName,
                title: userTitle || '', // Ensure title is never undefined
                avatar: userAvatar
            },
            content: content.trim(),
            image: images || [], // Array of image URLs from Cloudinary
            likes: 0,
            comments: 0,
            shares: 0,
            commentsBy: [],
            likedby: []
        });

        const savedPost = await newPost.save();

        res.status(201).json({
            message: 'Post created successfully',
            post: savedPost
        });
    } catch (error) {
        console.error('Error in createPost controller:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getPost, likePost, commentPost, deleteComment, createPost };
