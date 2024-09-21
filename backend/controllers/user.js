const User = require('../models/User');
const Notification = require('../models/Notification');
const upload = require('../utils/multerConfig');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// @desc    Follow a user
const followUser = async (req, res) => {
    const { userIdToFollow } = req.params;
    const currentUserId = req.user._id;

    try {
        if (currentUserId === userIdToFollow) {
            return res.status(400).json({ error: "You cannot follow yourself" });
        }

        // Add userIdToFollow to the current user's following list
        const currentUser = await User.findByIdAndUpdate(currentUserId, {
            $addToSet: { following: userIdToFollow }
        }, { new: true });


        // Add currentUserId to the userIdToFollow's followers list
        const followedUser = await User.findByIdAndUpdate(userIdToFollow, {
            $addToSet: { followers: currentUserId }
        }, { new: true });


        if (!currentUser || !followedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Create a notification for the followed user
        const newNotification = new Notification({
            type: 'new_follower',
            recipient: userIdToFollow,
            triggeredBy: currentUserId,
            isRead: false
        });

        // Save the notification to the database
        await newNotification.save();

        return res.status(200).json({
            message: `You have started following ${followedUser.username}`,
            currentUserFollowing: currentUser.following,
            followedUserFollowers: followedUser.followers
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: error.message });
    }
};

// @desc    Unfollow a user
const unfollowUser = async (req, res) => {
    const { userIdToUnfollow } = req.params;
    const currentUserId = req.user._id;

    try {
        // Check if the user is trying to unfollow themselves
        if (currentUserId === userIdToUnfollow) {
            return res.status(400).json({ error: "You cannot unfollow yourself" });
        }

        // Remove userIdToUnfollow from the current user's following list
        const currentUser = await User.findByIdAndUpdate(currentUserId, {
            $pull: { following: userIdToUnfollow }
        }, { new: true });

        // Remove currentUserId from the userIdToUnfollow's followers list
        const unfollowedUser = await User.findByIdAndUpdate(userIdToUnfollow, {
            $pull: { followers: currentUserId }
        }, { new: true });

        if (!currentUser || !unfollowedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json({
            message: `You have unfollowed ${unfollowedUser.username}`,
            currentUserFollowing: currentUser.following,
            unfollowedUserFollowers: unfollowedUser.followers
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: error.message });
    }
};

// @desc    Get user with a list of their followers and following
const getUserWithFollowingAndFollowers = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId)
            .populate('following', 'username avatar')
            .populate('followers', 'username avatar')
            .exec();

        return user;
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: error.message });
    }
};

// @desc    Check user's following status
const checkFollowingStatus = async (req, res) => {
    const userId = req.user._id;
    const { targetUserId } = req.params;

    console.log(userId);

    try {
        // Find the current user
        const user = await User.findById(userId).select('following');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isFollowing = user.following.includes(targetUserId);

        res.status(200).json({ isFollowing });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: error.message });
    }
};

// get user profile
const getUserProfile = async (req, res) => {

    const { userId } = req.params;

    try {
        const user = await User.findById(userId)
            .populate('following', 'username avatar')
            .populate('followers', 'username avatar')
            .select('-password')

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: error.message });
    }
};

// update user profile
const updateUserProfile = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        try {
            const userId = req.user._id;
            const { username, email, age, location } = req.body;

            // Find the user in the database
            let user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // If there's an avatar, handle the file upload
            if (req.files && req.files.avatar) {
                const avatarFile = req.files.avatar[0];

                // If the user already has an avatar, delete the old file
                if (user.avatar) {
                    const oldAvatarPath = path.join(__dirname, '..', user.avatar);
                    fs.unlink(oldAvatarPath, (err) => {
                        if (err) {
                            console.error('Error deleting old avatar:', err);
                        }
                    });
                }

                // Update user avatar field with the new file path
                user.avatar = `/uploads/avatars/${avatarFile.filename}`;
            }

            // Update other profile fields
            user.username = username || user.username;
            user.email = email || user.email;
            user.age = age || user.age;
            user.location = location || user.location;
            user.bio = req.body.bio || user.bio;
            user.website = req.body.website || user.website;
            user.pronouns = req.body.pronouns || user.pronouns;

            // Save updated user to the database
            const updatedUser = await user.save();

            return res.status(200).json({
                message: 'Profile updated successfully',
                user: {
                    username: updatedUser.username,
                    email: updatedUser.email,
                    age: updatedUser.age,
                    location: updatedUser.location,
                    avatar: updatedUser.avatar,
                    bio: updatedUser.bio,
                    website: updatedUser.website,
                    pronouns: updatedUser.pronouns,
                },
            });
        } catch (error) {
            console.error('Error updating profile:', error);
            return res.status(500).json({ error: 'Server error' });
        }
    });
};


const getUserHoveredDetails = async (req, res) => {
    const { userId } = req.params;

    try {
        const hoveredUser = await User.findById(userId)
            .select('username avatar followers following') // Select only the necessary fields
            .populate('followers following', 'username avatar'); // Populate followers and following if needed

        if (!hoveredUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Return the relevant user details
        return res.status(200).json({
            username: hoveredUser.username,
            avatar: hoveredUser.avatar,
            followers: hoveredUser.followers.length,
            following: hoveredUser.following.length,
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: error.message });
    }
};

// change password
const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    try {
        // Fetch the user from the database
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found.' });
        }

        // Compare the current password with the stored password hash
        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({ success: false, error: 'Current password is incorrect.' });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the user's password in the database
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({ success: true, message: 'Password changed successfully.' });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    followUser,
    unfollowUser,
    getUserWithFollowingAndFollowers,
    checkFollowingStatus,
    getUserProfile,
    updateUserProfile,
    getUserHoveredDetails,
    changePassword
};