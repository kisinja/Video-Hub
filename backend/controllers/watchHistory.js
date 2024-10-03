const WatchHistory = require('../models/WatchHistory');

const addWatchHistory = async (req, res) => {
    const { userId, videoId, watchedDuration } = req.body;

    try {
        const history = await WatchHistory.findOne({ userId });

        if (history) {
            history.watchedDuration = Math.max(history.watchedDuration, watchedDuration);

            await history.save();
        } else {
            history = new WatchHistory({ userId, videoId, watchedDuration });
            await history.save();
        }

        res.status(200).json(history);
    } catch (error) {
        console.log(error.message);
        return res.json({ error: error.message }).status(500);
    }
};

const getWatchHistory = async (req, res) => {
    try {
        const watchHistory = await WatchHistory.find({ userId: req.params.userId }).populate('videoId');
        res.status(200).json(watchHistory);
    } catch (error) {
        console.log(error.message);
        return res.json({ error: error.message }).status(500);
    }
};

module.exports = {
    addWatchHistory,
    getWatchHistory
};