const express = require('express');
const { getUserNotifications } = require('../controllers/notifications');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');

// Only authenticated users can access these routes
router.use(requireAuth);

// Get all notifications for the authenticated user
router.get('/', getUserNotifications);

module.exports = router;