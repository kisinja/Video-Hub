const Notification = require('../models/Notification');

// get all notifications for a user
const getUserNotifications = async (req, res) => {
    try {
        const userId = req.user._id;  // Assuming the user is authenticated
        const notifications = await Notification.find({ recipient: userId })
            .sort({ createdAt: -1 }) // Sort by newest notifications first
            .populate('triggeredBy', 'username avatar')
            .populate('video', 'title thumbnailUrl');

        res.status(200).json(notifications);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getUserNotifications,
};