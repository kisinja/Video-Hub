const Comment = require('../models/Comment');
const Video = require('../models/Video');

// Create a comment
const createComment = async (req, res) => {
    const { videoId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    try {
        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json({ error: 'Video not found' });
        }

        const comment = new Comment({ videoId, userId, content });
        await comment.save();

        res.status(201).json(comment);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
};

// Get all comments for a video
const getVideoComments = async (req, res) => {
    const { videoId } = req.params;

    try {

        // check if video exists
        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json({ error: 'Video not found' });
        }

        const comments = await Comment.find({ videoId }).populate('userId', "username avatar");
        res.status(200).json(comments);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
};

// Delete a comment
const deleteComment = async (req, res) => {
    const { commentId } = req.params;

    try {
        const comment = await Comment.findByIdAndDelete(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        res.status(200).json({ message: 'Comment deleted' });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
};

// Edit a comment
const updateComment = async (req, res) => {
    const { commentId } = req.params;

    try {
        const comment = await Comment.findByIdAndUpdate(commentId, req.body, { new: true });
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        res.status(200).json(comment);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
};

// Export the functions
module.exports = {
    createComment,
    getVideoComments,
    deleteComment,
    updateComment
};