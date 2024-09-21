const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    type: {
        type: String,
        enum: ['new_follower', 'new_comment', 'video_viewed', 'new_video', 'like'], // Add more types as needed
        required: true,
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    triggeredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video',
        required: false  // Only required for some types of notifications like 'new_comment', 'video_viewed', etc.
    },
    content: {
        type: String,
        required: false, // Can be used for additional details (like the comment text)
    },
    isRead: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;