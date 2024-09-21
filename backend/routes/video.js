const express = require('express');
const { uploadVideoController, getVideosController, getFeaturedVideos, getVideoById, likeVideo, unlikeVideo, dislikeVideo, undislikeVideo, getVideoLikedBy, incrementVideoViews, getUserVideos } = require('../controllers/video');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

router.use(requireAuth);

router.post('/upload', uploadVideoController);

router.get('/', getVideosController);

router.get('/featured', getFeaturedVideos);

router.get('/:id', getVideoById);

router.post('/:id/like', likeVideo);

router.post('/:id/unlike', unlikeVideo);

router.post('/:id/dislike', dislikeVideo);

router.post('/:id/undislike', undislikeVideo);

router.get('/:id/likedBy', getVideoLikedBy);

router.put('/:videoId/view', incrementVideoViews);

router.get('/user/:userId', getUserVideos);

module.exports = router;