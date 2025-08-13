const mongoose = require('mongoose');
require('dotenv').config();

const { Post } = require('./models/Post');

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
    console.error("❌ Missing MONGODB_URI in .env");
    process.exit(1);
}

mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);
    });

async function migrateComments() {
    try {
        console.log("🔄 Starting comment migration...");
        
        // Find all posts with comments
        const posts = await Post.find({ 'commentsBy.0': { $exists: true } });
        console.log(`📊 Found ${posts.length} posts with comments`);
        
        let updatedPosts = 0;
        let updatedComments = 0;
        
        for (const post of posts) {
            let hasUpdates = false;
            
            // Update each comment that doesn't have userId
            for (const comment of post.commentsBy) {
                if (!comment.userId) {
                    // For old comments, set userId to the comment's _id (which was the user ID)
                    comment.userId = comment._id;
                    hasUpdates = true;
                    updatedComments++;
                    console.log(`  ✅ Updated comment ${comment._id} in post ${post._id}`);
                }
            }
            
            if (hasUpdates) {
                // Save the post with updated comments
                await post.save();
                updatedPosts++;
                console.log(`  💾 Saved post ${post._id}`);
            }
        }
        
        console.log(`\n🎉 Migration completed!`);
        console.log(`📈 Updated ${updatedComments} comments in ${updatedPosts} posts`);
        
    } catch (error) {
        console.error("❌ Migration error:", error);
    } finally {
        mongoose.disconnect();
        console.log("🔌 Disconnected from MongoDB");
    }
}

migrateComments();
