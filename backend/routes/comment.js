const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const {
    createComment,
    getVideoComments,
    deleteComment,
    updateComment
} = require('../controllers/comment');

const router = express.Router();

// Protect all routes after this middleware
router.use(requireAuth);

// Routes
router.post('/:videoId', createComment);

router.get('/:videoId', getVideoComments);

router.delete('/:commentId', deleteComment);

router.put('/:commentId', updateComment);

module.exports = router;