const express = require('express');

const { followUser, unfollowUser, getUserWithFollowingAndFollowers, checkFollowingStatus, getUserProfile, updateUserProfile, getUserHoveredDetails } = require('../controllers/user');

const router = express.Router();

const requireAuth = require("../middleware/requireAuth");

router.use(requireAuth);

router.post("/:userIdToFollow/follow", followUser);

router.post("/:userIdToUnfollow/unfollow", unfollowUser);

router.get("/:userId", getUserWithFollowingAndFollowers);

router.get('/:userId/following/:targetUserId', checkFollowingStatus);

router.get('/profile/:userId', getUserProfile);

router.put('/update', updateUserProfile);

router.get('/:userId/hover', getUserHoveredDetails);

module.exports = router;