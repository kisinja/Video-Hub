const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    videoUrl: {
        type: String,
        required: true
    },
    thumbnailUrl: {
        type: String,
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    }],
    likes: {
        type: Number,
        default: 0,
        min: 0
    },
    dislikes: {
        type: Number,
        default: 0,
        min: 0
    },
    likedBy: [{  // Array to store user IDs who liked the video
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    dislikedBy: [{ // Array to store user IDs who disliked the video
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    views: {
        type: Number,
        default: 0,
        min: 0
    },
    viewedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
    }],
}, { timestamps: true });

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;