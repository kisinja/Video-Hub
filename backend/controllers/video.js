const Video = require('../models/Video');
const upload = require('../utils/multerConfig');
const { exec } = require('child_process');
const Notification = require('../models/Notification');

// Upload Video and Thumbnail together, and integrate Python analysis
const uploadVideoController = (req, res) => {
    // Use Multer to upload the video and thumbnail
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        const { title, description } = req.body;

        // Validate that both files (video and thumbnail) are uploaded
        if (!req.files['videoUrl'] || !req.files['thumbnailUrl']) {
            return res.status(400).json({ error: 'Both video and thumbnail are required' });
        }

        // Construct the paths for video and thumbnail
        const videoUrl = `/uploads/videos/${req.files['videoUrl'][0].filename}`;
        const thumbnailUrl = `/uploads/thumbnails/${req.files['thumbnailUrl'][0].filename}`;

        // Execute Python script to classify the video based on title and description
        const script = `python main.py "${title}" "${description}"`;

        exec(script, (err, stdout, stderr) => {
            if (err) {
                console.error(`Error executing Python script: ${stderr}`);
                return res.status(500).json({ error: "Error analyzing video metadata." });
            }

            // Check if Python script classified it as a "How-to" video
            const isHowTo = stdout.trim() === "True";

            if (!isHowTo) {
                return res.status(400).json({ error: "Video is not a 'How-to' video." });
            }

            // Save the video information to the database if it's a 'How-to' video
            const newVideo = new Video({
                title,
                description,
                videoUrl,
                thumbnailUrl,
                uploadedBy: req.user._id,
            });

            newVideo.save()
                .then(video => res.status(200).json({
                    message: 'Video and thumbnail uploaded successfully!',
                    video
                }))
                .catch(error => {
                    res.status(500).json({ error: error.message });
                });
        });
    });
};

const getVideosController = async (req, res) => {
    try {
        const videos = await Video.find().populate("uploadedBy", "avatar username");
        res.status(200).json(videos);
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.log(error.message);
    }
};

const getFeaturedVideos = async (req, res) => {
    try {
        const videos = await Video.find().limit(3).sort({ createdAt: -1 }).populate("uploadedBy", "avatar username");
        res.status(200).json(videos);
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.log(error.message);
    }
};

const getVideoById = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id).populate("uploadedBy", "avatar username");
        if (!video) {
            res.status(200).json({ message: "No such video" });
        }

        res.status(200).json(video);
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.log(error.message);
    }
};

// like a video
const likeVideo = async (req, res) => {

    const videoId = req.params.id;
    const userId = req.user._id;

    try {
        const video = await Video.findById(videoId);

        if (!video) {
            return res.status(404).json({ message: 'Video not found.' });
        }

        // Check if the user has already liked the video
        const hasLiked = video.likedBy.includes(userId);
        const hasDisliked = video.dislikedBy.includes(userId);

        // If the user already liked the video, unlike it
        if (hasLiked) {
            video.likes -= 1;
            video.likedBy.pull(userId); // Remove user from likedBy array
        } else {
            // If the user had previously disliked the video, undislike it
            if (hasDisliked) {
                video.dislikes -= 1;
                video.dislikedBy.pull(userId); // Remove user from dislikedBy array
            }
            // Like the video
            video.likes += 1;
            video.likedBy.push(userId);
        }

        await video.save();

        // create a new notification for the video owner
        const notification = new Notification({
            type: 'like',
            recipient: video.uploadedBy._id,
            triggeredBy: userId,
            video: videoId
        });

        await notification.save();

        return res.status(200).json({ message: 'Successfully updated like status', video });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
};

// unlike a video
const unlikeVideo = async (req, res) => {
    const videoId = req.params.id;
    const userId = req.user._id;

    try {
        const video = await Video.findById(videoId);

        if (!video) {
            return res.status(404).json({ message: 'Video not found.' });
        }

        // Check if the user has already disliked the video
        const hasDisliked = video.dislikedBy.includes(userId);
        const hasLiked = video.likedBy.includes(userId);

        // If the user already disliked the video, undislike it
        if (hasDisliked) {
            video.dislikes -= 1;
            video.dislikedBy.pull(userId); // Remove user from dislikedBy array
        } else {
            // If the user had previously liked the video, unlike it
            if (hasLiked) {
                video.likes -= 1;
                video.likedBy.pull(userId); // Remove user from likedBy array
            }
            // Dislike the video
            video.dislikes += 1;
            video.dislikedBy.push(userId);
        }

        await video.save();
        return res.status(200).json({ message: 'Successfully updated dislike status', video });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
};

// disliking a video
const dislikeVideo = async (req, res) => {
    const userId = req.user._id;
    const { id } = req.params;

    try {
        const video = await Video.findById(id);
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        // Check if user already disliked the video
        if (video.dislikedBy.includes(userId)) {
            return res.status(400).json({ message: 'Already disliked' });
        }

        // Add user to dislikedBy array and update the dislike count
        video.dislikes += 1;
        video.dislikedBy.push(userId);

        // If the user liked the video, remove the like
        if (video.likedBy.includes(userId)) {
            video.likes -= 1;
            video.likedBy.pull(userId);
        }

        await video.save();
        res.status(200).json(video);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
};

// undisliking a video
const undislikeVideo = async (req, res) => {
    const userId = req.user._id;
    const { id } = req.params;

    try {
        const video = await Video.findById(id);
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        // Check if user hasn't disliked the video
        if (!video.dislikedBy.includes(userId)) {
            return res.status(400).json({ message: 'Not disliked yet' });
        }

        // Remove user from dislikedBy array and update the dislike count
        video.dislikes -= 1;
        video.dislikedBy.pull(userId);

        await video.save();
        res.status(200).json(video);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
};

// get users who liked a video
const getVideoLikedBy = async (req, res) => {
    const { id } = req.params;

    try {
        const video = await Video.findById(id).populate('likedBy', 'username avatar');
        if (!video) {
            return res.status(404).json({ error: 'Video not found' });
        }

        const likedBy = video.likedBy;

        res.status(200).json({
            count: likedBy.length,
            likedBy
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
};

// increment video views
const incrementVideoViews = async (req, res) => {
    const { videoId } = req.params;
    try {
        const video = await Video.findByIdAndUpdate(
            videoId,
            { $inc: { views: 1 } },
            { new: true }
        );
        if (!video) {
            return res.status(404).json({ error: 'Video not found' });
        }

        res.status(200).json(video);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
};

// get user uploaded videos
const getUserVideos = async (req, res) => {
    const { userId } = req.params;

    try {
        const videos = await Video.find({ uploadedBy: userId })
            .populate('likedBy', 'username avatar')
            .populate('uploadedBy', 'username avatar')
            .sort({ createdAt: -1 });

        if (!videos || videos.length === 0) {  // Check for both null and empty array
            return res.status(404).json({ error: 'No videos found' });
        }

        res.status(200).json(videos);
    } catch (error) {
        console.log(error.message);
        // Avoid sending a response if headers have already been sent
        if (!res.headersSent) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = {
    uploadVideoController,
    getVideosController,
    getFeaturedVideos,
    getVideoById,
    likeVideo,
    unlikeVideo,
    dislikeVideo,
    undislikeVideo,
    getVideoLikedBy,
    incrementVideoViews,
    getUserVideos
};