const express = require('express');

const { followUser, unfollowUser, getUserWithFollowingAndFollowers, checkFollowingStatus, getUserProfile, updateUserProfile, getUserHoveredDetails, changePassword } = require('../controllers/user');

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

router.put('/change-password', changePassword);

module.exports = router;