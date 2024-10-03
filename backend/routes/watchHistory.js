const express = require('express');
const router = express.Router();

const {
    getWatchHistory,
    addWatchHistory
} = require('../controllers/');

router.get('/:userId', getWatchHistory);

router.post('/', addWatchHistory);

module.exports = router;