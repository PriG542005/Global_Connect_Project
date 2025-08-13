const mongoose = require('mongoose');

// User/Profile Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    trim: true
  },
  avatar: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Comment Schema (embedded in Post)
const commentSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false // Make optional to handle existing comments
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  comment: {
    type: String,
    required: true,
    trim: true
  },
  time: {
    type: String,
    default: () => new Date().toISOString()
  },
  avatar: {
    type: String,
    required: true
  }
}, { _id: false }); // Disable auto _id since we're providing it

// Liked By Schema (embedded in Post)
const likedBySchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    trim: true
  },
  avatar: {
    type: String,
    required: true
  }
}, { _id: false }); // Disable auto _id since we're providing it

// Post Schema
const postSchema = new mongoose.Schema({
  author: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    title: {
      type: String,
      required: false,
      trim: true,
      default: ''
    },
    avatar: {
      type: String,
      required: true
    }
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  image: [{
    type: String
  }],
  
  likes: {
    type: Number,
    default: 0
  },
  comments: {
    type: Number,
    default: 0
  },
  commentsBy: [commentSchema],
  shares: {
    type: Number,
    default: 0
  },
  likedby: [likedBySchema]
}, {
  timestamps: true
});

// Create models
const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);

module.exports = { User, Post };
