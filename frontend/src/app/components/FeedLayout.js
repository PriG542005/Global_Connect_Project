"use client"
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useStore } from "../context/store";
import { Heart, MessageCircle, Share2, Send, MoreHorizontal, Camera, FileText, Calendar, X, ChevronLeft, ChevronRight, Loader2, Trash2, Image, Plus } from 'lucide-react';
import axios from 'axios';

const formatTimeAgo = (dateString) => {
    if (!dateString) return '';
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now - date) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return "just now";
};

// Likes Modal Component
const LikesModal = ({ isOpen, onClose, likedBy, postId }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
            <div 
                className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-96 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Liked by {likedBy?.length || 0} {(likedBy?.length || 0) === 1 ? 'person' : 'people'}
                    </h3>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="overflow-y-auto max-h-80 hide-scrollbar">
                    {likedBy && likedBy.length > 0 ? (
                        <div className="p-2">
                            {likedBy.map((user) => (
                                <div key={user._id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                    <img 
                                        src={user.avatar || "https://i.pravatar.cc/40?u=" + user._id} 
                                        alt={user.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{user.name}</p>
                                        {user.title && (
                                            <p className="text-sm text-gray-500">{user.title}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            No likes yet
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Multi-Image Grid Component
const ImageGrid = ({ images, onImageClick }) => {
    if (!images || images.length === 0) return null;

    const imageCount = images.length;

    // Single image
    if (imageCount === 1) {
        return (
            <div className="mt-4">
                <img 
                    src={images[0]} 
                    alt="Post image"
                    className="w-full h-96 object-cover rounded-lg cursor-pointer hover:opacity-95 transition-opacity"
                    onClick={() => onImageClick(0)}
                />
            </div>
        );
    }

    // Two images
    if (imageCount === 2) {
        return (
            <div className="mt-4 grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
                {images.map((image, index) => (
                    <img 
                        key={index}
                        src={image} 
                        alt={`Post image ${index + 1}`}
                        className="w-full h-48 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                        onClick={() => onImageClick(index)}
                    />
                ))}
            </div>
        );
    }

    // Three images
    if (imageCount === 3) {
        return (
            <div className="mt-4 grid grid-cols-2 gap-1 rounded-lg overflow-hidden h-96">
                <img 
                    src={images[0]} 
                    alt="Post image 1"
                    className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                    onClick={() => onImageClick(0)}
                />
                <div className="grid grid-rows-2 gap-1">
                    <img 
                        src={images[1]} 
                        alt="Post image 2"
                        className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                        onClick={() => onImageClick(1)}
                    />
                    <img 
                        src={images[2]} 
                        alt="Post image 3"
                        className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                        onClick={() => onImageClick(2)}
                    />
                </div>
            </div>
        );
    }

    // Four or more images
    return (
        <div className="mt-4 grid grid-cols-2 gap-1 rounded-lg overflow-hidden h-96">
            {images.slice(0, 3).map((image, index) => (
                <img 
                    key={index}
                    src={image} 
                    alt={`Post image ${index + 1}`}
                    className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                    onClick={() => onImageClick(index)}
                />
            ))}
            <div 
                className="relative cursor-pointer group"
                onClick={() => onImageClick(3)}
            >
                <img 
                    src={images[3]} 
                    alt="Post image 4"
                    className="w-full h-full object-cover"
                />
                {imageCount > 4 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center group-hover:bg-opacity-60 transition-all">
                        <span className="text-white text-2xl font-bold">+{imageCount - 4}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

const FeedLayout = () => {
    const { token, user } = useStore();
    console.log('FeedLayout: Component rendered. Token:', token ? 'Available' : 'Not Available', 'User:', user);
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const feedContainerRef = useRef(null);
    
    const loadingRef = useRef(loading);
    loadingRef.current = loading;

    const [newPost, setNewPost] = useState("");
    const [selectedImages, setSelectedImages] = useState([]);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [postingContent, setPostingContent] = useState(false);
    const [showComments, setShowComments] = useState({});
    const [imageModal, setImageModal] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [commentInputs, setCommentInputs] = useState({});
    const [likesModal, setLikesModal] = useState({ isOpen: false, postId: null, likedBy: [] });
    const fileInputRef = useRef(null);

    const fetchPosts = useCallback(async (currentPage) => {
        setLoading(true);
        setError(null);
        try {
            if (!token || !user?.id) { // Ensure user.id is available before fetching
                console.log('Skipping fetch: token or user.id not available yet.');
                setLoading(false);
                return; 
            }
            
            console.log(`Fetching page ${currentPage} for user: ${user.id}`);
            
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/posts/all?page=${currentPage}&limit=10`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log('API Response:', response.data);
            
            const postsData = (response.data.posts || response.data).map(post => {
                const processedPost = {
                    ...post,
                    likedby: post.likedby ? post.likedby.map(likedUser => {
                        console.log(`Fetched likedUser._id: ${likedUser._id}, type: ${typeof likedUser._id}`);
                        const stringId = likedUser._id.toString();
                        console.log(`Converted likedUser._id to string: ${stringId}`);
                        return { ...likedUser, _id: stringId };
                    }) : [],
                    commentsBy: post.commentsBy ? post.commentsBy.map(comment => ({
                        ...comment,
                        _id: comment._id.toString()
                    })) : []
                };
                // Add a temporary 'isLikedByCurrentUser' flag for easier rendering logic
                processedPost.isLikedByCurrentUser = processedPost.likedby.some(likedUser => {
                    console.log(`Comparing likedUser._id: ${likedUser._id} (type: ${typeof likedUser._id}) with user.id: ${user.id} (type: ${typeof user.id})`);
                    return likedUser._id === user.id;
                });
                console.log(`Post ${processedPost._id} isLikedByCurrentUser: ${processedPost.isLikedByCurrentUser}`);
                return processedPost;
            });
            const totalPagesData = response.data.totalPages || response.data.pagination?.totalPages || Math.ceil((response.data.pagination?.totalPosts || postsData.length) / 10);
            
            setPosts(prevPosts => {
                if (currentPage === 1) {
                    console.log('Setting initial posts:', postsData.length);
                    return postsData;
                }
                
                const existingIds = new Set(prevPosts.map(post => post._id));
                const newUniquePosts = postsData.filter(post => !existingIds.has(post._id));
                
                console.log(`Adding ${newUniquePosts.length} new posts out of ${postsData.length} fetched`);
                
                return [...prevPosts, ...newUniquePosts];
            });
            setTotalPages(totalPagesData);
            
            console.log(`Total pages: ${totalPagesData}`);
            
        } catch (err) {
            console.error('Fetch error:', err);
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    }, [token, user?.id]); // Depend on user.id to trigger fetch when it's available

    useEffect(() => {
        setPosts([]);
        setPage(1);
        setTotalPages(1);
        console.log('FeedLayout useEffect: Checking token and user.id for initial fetch. Token:', token ? 'Available' : 'Not Available', 'User ID:', user?.id);
        if (token && user?.id) { // Only fetch if token and user.id are available
            fetchPosts(1);
        }
    }, [token, user?.id, fetchPosts]); // Added user?.id to dependency array

    useEffect(() => {
        let timeoutId = null;
        
        const handleScroll = () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            
            timeoutId = setTimeout(() => {
                const container = feedContainerRef.current;
                if (!container) {
                    console.log('Container ref not found');
                    return;
                }
                
                const scrollTop = container.scrollTop;
                const containerHeight = container.clientHeight;
                const scrollHeight = container.scrollHeight;
                const scrollPercentage = (scrollTop + containerHeight) / scrollHeight;
                
                if (scrollPercentage > 0.7 && !loadingRef.current && page < totalPages) {
                    console.log('Loading next page:', page + 1);
                    setPage(prevPage => prevPage + 1);
                }
            }, 100);
        };

        const container = feedContainerRef.current;
        if (container) {
            console.log('Adding scroll listener to container');
            container.addEventListener('scroll', handleScroll);
            return () => {
                container.removeEventListener('scroll', handleScroll);
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
            };
        }
    }, [page, totalPages]);

    useEffect(() => {
        if (page > 1) {
            fetchPosts(page);
        }
    }, [page, fetchPosts]);

    useEffect(() => {
        if (imageModal || likesModal.isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => { document.body.style.overflow = 'auto'; };
    }, [imageModal, likesModal.isOpen]);

    const handleLike = async (postId) => {
        if (!token || !user) {
            setError("You must be logged in to like posts.");
            return;
        }

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/posts/like`, 
                { postId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 200) {
                setPosts(prevPosts => prevPosts.map(post => {
                    if (post._id === postId) {
                        // Ensure user.id is available and valid for comparison
                        const currentUserId = user?.id; 
                        const isCurrentlyLiked = post.likedby.some(likedUser => likedUser._id === currentUserId);
                        
                        console.log(`Optimistic update for postId: ${postId}, currentUserId: ${currentUserId}`);
                        console.log('Post likedby before update:', post.likedby.map(l => l._id));
                        console.log('Is currently liked (frontend check):', isCurrentlyLiked);

                        let updatedLikedBy;
                        let updatedLikesCount;

                        if (isCurrentlyLiked) {
                            updatedLikedBy = post.likedby.filter(likedUser => likedUser._id !== currentUserId);
                            updatedLikesCount = Math.max(0, post.likes - 1);
                        } else {
                            // Ensure _id is a string for consistency with fetched data
                            updatedLikedBy = [...post.likedby, { _id: currentUserId, name: user.name, avatar: user.avatar, title: user.title }];
                            updatedLikesCount = post.likes + 1;
                        }
                        console.log('Post likedby after update:', updatedLikedBy.map(l => l._id));
                        return { ...post, likes: updatedLikesCount, likedby: updatedLikedBy, isLikedByCurrentUser: !isCurrentlyLiked };
                    }
                    return post;
                }));
            }
        } catch (err) {
            console.error('Error liking post:', err);
            setError(err.response?.data?.message || 'Failed to like/unlike post.');
        }
    };

    const handleAddComment = async (postId) => {
        const commentText = commentInputs[postId]?.trim();
        if (!commentText) {
            setError("Comment cannot be empty.");
            return;
        }
        if (!token || !user) {
            setError("You must be logged in to comment.");
            return;
        }

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/posts/comment`, 
                { postId, comment: commentText },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 201) {
                const newComment = response.data.comment; // Backend returns the new comment object
                setPosts(prevPosts => prevPosts.map(p => 
                    p._id === postId ? { 
                        ...p, 
                        commentsBy: [...(p.commentsBy || []), newComment], 
                        comments: (p.comments || 0) + 1 
                    } : p
                ));
                // Update comment in image modal if it's open for this post
                if(imageModal?._id === postId) {
                    setImageModal(prev => ({
                        ...prev, 
                        commentsBy: [...(prev.commentsBy || []), newComment], 
                        comments: (prev.comments || 0) + 1
                    }));
                }
                setCommentInputs(prev => ({ ...prev, [postId]: '' })); // Clear specific comment input
            }
        } catch (err) {
            console.error('Error adding comment:', err);
            setError(err.response?.data?.message || 'Failed to add comment.');
        }
    };

    const handleDeleteComment = async (postId, commentId) => {
        if (!token) {
            setError('You must be logged in to delete comments.');
            return;
        }



        try {
            const deleteUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/posts/comment?postId=${postId}&commentId=${commentId}`;
            console.log('🚀 Sending delete request:', {
                url: deleteUrl,
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            const response = await axios.delete(deleteUrl, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 200) {
                // Update posts state by removing the deleted comment
                setPosts(prevPosts => prevPosts.map(p =>
                    p._id === postId ? {
                        ...p,
                        commentsBy: p.commentsBy.filter(comment => comment._id !== commentId),
                        comments: Math.max(0, (p.comments || 0) - 1)
                    } : p
                ));

                // Update comment in image modal if it's open for this post
                if(imageModal?._id === postId) {
                    setImageModal(prev => ({
                        ...prev,
                        commentsBy: prev.commentsBy.filter(comment => comment._id !== commentId),
                        comments: Math.max(0, (prev.comments || 0) - 1)
                    }));
                }
            }
        } catch (err) {
            console.error('Error deleting comment:', err);
            setError(err.response?.data?.message || 'Failed to delete comment.');
        }
    };

    const handleCommentInputChange = (postId, value) => {
        setCommentInputs(prev => ({ ...prev, [postId]: value }));
    };

    const toggleComments = (postId) => {
        setShowComments(prev => ({ ...prev, [postId]: !prev[postId] }));
    };

    const openImageModal = (post, imageIndex = 0) => {
        setImageModal(post);
        setCurrentImageIndex(imageIndex);
    };

    const closeImageModal = () => {
        setImageModal(null);
        setCurrentImageIndex(0);
    };

    const nextImage = () => {
        if (!imageModal || !imageModal.image || imageModal.image.length === 0) return;
        setCurrentImageIndex((prev) => (prev + 1) % imageModal.image.length);
    };

    const prevImage = () => {
        if (!imageModal || !imageModal.image || imageModal.image.length === 0) return;
        setCurrentImageIndex((prev) => (prev - 1 + imageModal.image.length) % imageModal.image.length);
    };

    const openLikesModal = (postId, likedBy) => {
        setLikesModal({
            isOpen: true,
            postId,
            likedBy: likedBy || []
        });
    };

    const closeLikesModal = () => {
        setLikesModal({
            isOpen: false,
            postId: null,
            likedBy: []
        });
    };

    // Handle image selection
    const handleImageSelect = (event) => {
        const files = Array.from(event.target.files);

        // Validate file count (max 10)
        if (selectedImages.length + files.length > 10) {
            setError('Maximum 10 images allowed per post');
            return;
        }

        // Validate file types
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        const invalidFiles = files.filter(file => !validTypes.includes(file.type));

        if (invalidFiles.length > 0) {
            setError('Only JPEG, PNG, GIF, and WebP images are allowed');
            return;
        }

        // Validate file sizes (max 5MB each)
        const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
        if (oversizedFiles.length > 0) {
            setError('Each image must be less than 5MB');
            return;
        }

        // Add files to selected images with preview URLs
        const newImages = files.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            id: Date.now() + Math.random()
        }));

        setSelectedImages(prev => [...prev, ...newImages]);
        setError(null);
    };

    // Remove selected image
    const removeImage = (imageId) => {
        setSelectedImages(prev => {
            const imageToRemove = prev.find(img => img.id === imageId);
            if (imageToRemove) {
                URL.revokeObjectURL(imageToRemove.preview);
            }
            return prev.filter(img => img.id !== imageId);
        });
    };

    // Upload images directly to Cloudinary
    const uploadImagesToCloudinary = async (images) => {
        const uploadedUrls = [];

        for (const image of images) {
            const formData = new FormData();
            formData.append('file', image.file);

            try {
                // Use backend upload for now (will be direct to Cloudinary later)
                const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/assets/upload`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                });

                uploadedUrls.push(response.data.url);
            } catch (error) {
                console.error('Error uploading image:', error);
                throw new Error(`Failed to upload image: ${image.file.name}`);
            }
        }

        return uploadedUrls;
    };

    // Handle post creation
    const handleCreatePost = async () => {
        if (!newPost.trim() && selectedImages.length === 0) {
            setError('Please add some content or images to your post');
            return;
        }

        if (!token) {
            setError('You must be logged in to create a post');
            return;
        }

        setPostingContent(true);
        setError(null);

        try {
            let imageUrls = [];

            // Upload images if any are selected
            if (selectedImages.length > 0) {
                setUploadingImages(true);
                imageUrls = await uploadImagesToCloudinary(selectedImages);
                setUploadingImages(false);
            }

            // Create the post
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/posts/create`, {
                content: newPost.trim(),
                images: imageUrls
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 201) {
                // Clear form
                setNewPost('');
                setSelectedImages(prev => {
                    // Clean up preview URLs
                    prev.forEach(img => URL.revokeObjectURL(img.preview));
                    return [];
                });

                // Refresh posts to show the new post
                await fetchPosts(1);
                setPage(1);

                console.log('Post created successfully');
            }
        } catch (error) {
            console.error('Error creating post:', error);
            setError(error.response?.data?.message || 'Failed to create post');
        } finally {
            setPostingContent(false);
            setUploadingImages(false);
        }
    };

    return (
        <div 
            ref={feedContainerRef}
            className="h-full overflow-y-auto bg-gray-50 text-gray-800 font-sans hide-scrollbar"
        >
            <div className="container mx-auto max-w-3xl xl:max-w-4xl px-2 sm:px-4 py-6">
                
                {/* Create Post Section */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 mb-6 p-4 sm:p-5">
                    <div className="flex items-start space-x-4">
                        <img
                            src={user?.avatar || "https://i.pravatar.cc/56?u=guest"}
                            alt="Your avatar"
                            className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                            <textarea
                                value={newPost}
                                onChange={(e) => setNewPost(e.target.value)}
                                placeholder="What's on your mind?"
                                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                rows="3"
                                disabled={postingContent}
                            />

                            {/* Selected Images Preview */}
                            {selectedImages.length > 0 && (
                                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                    {selectedImages.map((image) => (
                                        <div key={image.id} className="relative group">
                                            <img
                                                src={image.preview}
                                                alt="Preview"
                                                className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                            />
                                            <button
                                                onClick={() => removeImage(image.id)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                disabled={postingContent}
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}

                                    {/* Add more images button */}
                                    {selectedImages.length < 10 && (
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-400 transition"
                                            disabled={postingContent}
                                        >
                                            <Plus size={24} />
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Upload Progress */}
                            {uploadingImages && (
                                <div className="mt-3 flex items-center space-x-2 text-blue-600">
                                    <Loader2 className="animate-spin" size={16} />
                                    <span className="text-sm">Uploading images...</span>
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row items-center justify-between mt-3">
                                <div className="flex items-center space-x-2 sm:space-x-4 mb-3 sm:mb-0">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition"
                                        disabled={postingContent || selectedImages.length >= 10}
                                    >
                                        <Camera size={20} />
                                        <span className="text-sm font-medium hidden xs:inline">
                                            Photo ({selectedImages.length}/10)
                                        </span>
                                    </button>

                                    {/* Hidden file input */}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        multiple
                                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                        onChange={handleImageSelect}
                                        className="hidden"
                                    />
                                </div>
                                <button
                                    onClick={handleCreatePost}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                    disabled={(!newPost.trim() && selectedImages.length === 0) || postingContent}
                                >
                                    {postingContent && <Loader2 className="animate-spin" size={16} />}
                                    <span>{postingContent ? 'Posting...' : 'Post'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Posts */}
                {posts.map((post) => (
                    <div key={post._id} className="bg-white rounded-xl shadow-md border border-gray-200 mb-6 overflow-hidden">
                        {/* Post Header */}
                        <div className="p-4 sm:p-5">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-3">
                                    <img 
                                        src={post.author?.avatar || "https://i.pravatar.cc/48?u=" + post.author?._id} 
                                        alt={post.author?.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{post.author?.name}</h3>
                                        {post.author?.title && (
                                            <p className="text-sm text-gray-600">{post.author.title}</p>
                                        )}
                                        <p className="text-xs text-gray-500">{formatTimeAgo(post.createdAt)}</p>
                                    </div>
                                </div>
                                <button className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition">
                                    <MoreHorizontal size={20} />
                                </button>
                            </div>

                            {/* Post Content */}
                            <div className="mt-4">
                                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                            </div>
                        </div>

                        {/* Images */}
                        <ImageGrid 
                            images={post.image} 
                            onImageClick={(imageIndex) => openImageModal(post, imageIndex)}
                        />

                        {/* Post Actions */}
                        <div className="p-4 sm:p-5 border-t border-gray-100">
                            {/* Reaction Summary */}
                            <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                                <button 
                                    onClick={() => openLikesModal(post._id, post.likedby)}
                                    className="hover:underline cursor-pointer"
                                >
                                    {post.likes > 0 && `${post.likes} ${post.likes === 1 ? 'like' : 'likes'}`}
                                </button>
                                <div className="flex space-x-4">
                                    {post.comments > 0 && (
                                        <span>{post.comments} {post.comments === 1 ? 'comment' : 'comments'}</span>
                                    )}
                                    {post.shares > 0 && (
                                        <span>{post.shares} {post.shares === 1 ? 'share' : 'shares'}</span>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                                <button 
                                    onClick={() => handleLike(post._id)}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                                        post.isLikedByCurrentUser 
                                            ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    <Heart size={20} className={post.isLikedByCurrentUser ? 'fill-current' : ''} />
                                    <span className="font-medium">Like</span>
                                </button>
                                <button 
                                    onClick={() => toggleComments(post._id)}
                                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
                                >
                                    <MessageCircle size={20} />
                                    <span className="font-medium">Comment</span>
                                </button>
                                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition">
                                    <Share2 size={20} />
                                    <span className="font-medium">Share</span>
                                </button>
                            </div>

                            {/* Comments Section */}
                            {showComments[post._id] && (
                                <div className="mt-4 space-y-3">
                                    {/* Add Comment */}
                                    <div className="flex items-start space-x-3">
                                        <img 
                                          src={post.author?.avatar || "https://i.pravatar.cc/48?u=" + post.author?._id} 
                                            alt="Your avatar"
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                        <div className="flex-1 flex items-center space-x-2">
                                            <input
                                                type="text"
                                                value={commentInputs[post._id] || ''}
                                                onChange={(e) => handleCommentInputChange(post._id, e.target.value)}
                                                placeholder="Write a comment..."
                                                className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                                                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleAddComment(post._id)}
                                            />
                                            <button 
                                                onClick={() => handleAddComment(post._id)}
                                                className="text-blue-600 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50 transition"
                                            >
                                                <Send size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Existing Comments */}
                                    {post.commentsBy && post.commentsBy.map((comment) => (
                                        <div key={comment._id} className="flex items-start space-x-3">
                                            <img
                                                src={comment.avatar || "https://i.pravatar.cc/32?u=" + comment._id}
                                                alt={comment.name}
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                            <div className="flex-1 bg-gray-100 rounded-lg px-4 py-2">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="font-medium text-sm text-gray-900">{comment.name}</span>
                                                        <span className="text-xs text-gray-500">{formatTimeAgo(comment.time)}</span>
                                                    </div>
                                                    {/* Show delete button only for user's own comments */}
                                                    {user && (
                                                        (comment.userId && comment.userId === user.id) ||
                                                        (!comment.userId && comment._id === user.id)
                                                    ) && (
                                                        <button
                                                            onClick={() => handleDeleteComment(post._id, comment._id)}
                                                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                                                            title="Delete comment"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-800 mt-1">{comment.comment}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {/* Loading Indicator */}
                {loading && (
                    <div className="flex justify-center py-8">
                        <Loader2 className="animate-spin text-blue-600" size={32} />
                    </div>
                )}

                {/* End of Posts Message */}
                {!loading && page >= totalPages && posts.length > 0 && (
                    <div className="text-center py-8 text-gray-500">
                        You've reached the end of the feed
                    </div>
                )}
            </div>

            {/* Image Modal */}
            {imageModal && imageModal.image && imageModal.image.length > 0 && (
                <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50" onClick={closeImageModal}>
                    <div className="relative w-full h-full max-w-4xl max-h-[90vh] flex items-center justify-center">
                        {/* Close Button */}
                        <button 
                            onClick={closeImageModal}
                            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full p-2"
                        >
                            <X size={24} />
                        </button>

                        {/* Navigation Buttons */}
                        {imageModal.image.length > 1 && (
                            <>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full p-2"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full p-2"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </>
                        )}

                        {/* Image */}
                        <img 
                            src={imageModal.image[currentImageIndex]} 
                            alt={`Image ${currentImageIndex + 1}`}
                            className="max-w-full max-h-full object-contain"
                            onClick={(e) => e.stopPropagation()}
                            style={{ width: 'auto', height: 'auto', maxWidth: '90vw', maxHeight: '90vh' }}
                        />

                        {/* Image Counter */}
                        {imageModal.image.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                                {currentImageIndex + 1} / {imageModal.image.length}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Likes Modal */}
            <LikesModal 
                isOpen={likesModal.isOpen}
                onClose={closeLikesModal}
                likedBy={likesModal.likedBy}
                postId={likesModal.postId}
            />
        </div>
    );
};

export default FeedLayout;
