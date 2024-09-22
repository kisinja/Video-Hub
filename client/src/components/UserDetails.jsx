import { useState } from "react";
import FollowButton from "./FollowButton"
import { createPublicRequest } from "../axiosConfig";
import { useSelector } from "react-redux";

const UserDetails = ({ video, userId }) => {

    const [isHovered, setIsHovered] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [followers, setFollowers] = useState(0);
    const [following, setFollowing] = useState(0);

    const { currentUser } = useSelector(state => state.user);
    const onlineUsers = useSelector((state) => state.user.onlineUsers);

    // Check if the current user is online
    const isOnline = onlineUsers[currentUser._id]?.online;

    // Function to handle fetching user details when hover begins
    const handleMouseEnter = async () => {
        setIsHovered(true); // Set hover state to true

        try {
            const publicRequest = createPublicRequest(currentUser?.token);
            const response = await publicRequest.get(`/users/${video?.uploadedBy?._id}/hover`);

            if (response.status === 200) {
                setUserInfo(response.data);

                // Destructure the followers and following count from the response
                const { followers, following } = response.data;
                setFollowers(followers);
                setFollowing(following);

                console.log(followers, following);
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    // Function to handle mouse leave
    const handleMouseLeave = () => {
        setIsHovered(false); // Set hover state to false
        setUserInfo(null); // Clear the user details
    };

    const imgUrl = video.uploadedBy.avatar.startsWith('/uploads/avatar') ? `http://localhost:3500${video.uploadedBy.avatar}` : video.uploadedBy.avatar;

    return (
        <div
            className='relative cursor-pointer'
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Display the uploader's username and avatar */}
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <img
                        src={imgUrl}
                        alt="Uploader Avatar"
                        className="w-12 h-12 rounded-full"
                    />
                    {/* Show the green dot if the uploader is online */}
                    {isOnline && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    )}
                </div>
                <div>
                    <p className="font-light tracking-wider">
                        {video?.uploadedBy?.username || 'Loading...'}
                    </p>
                    <FollowButton
                        userId={userId}
                        targetUserId={video?.uploadedBy?._id}
                    />
                </div>
            </div>

            {/* Popover with Followers, Following, and Follow Button */}
            {isHovered && userInfo && (
                <div className='absolute bg-gray-800 p-4 rounded shadow-lg border border-gray-300 top-full mt-2 w-[200px] flex flex-col gap-2 divide-y divide-gray-500'>
                    <div>
                        <img
                            src={imgUrl}
                            alt="Uploader Avatar"
                            className="w-12 h-12 rounded-full"
                        />
                        <div>
                            <p className="font-light tracking-wider">{userInfo.username || 'Loading...'}</p>
                        </div>
                    </div>

                    <div className="pt-2">
                        <p className="text-sm text-white tracking-wider">
                            <span className="text-red-700">
                                {followers}
                            </span> followers
                        </p>
                        <p className="text-sm text-white tracking-wider">
                            <span className="text-red-700">
                                {following}
                            </span> following
                        </p>
                    </div>

                    {/* Conditionally display the Follow button if not already followed */}
                    {/* {!userInfo.isFollowedByCurrentUser && (
                        <FollowButton
                            userId={userId}
                            targetUserId={video?.uploadedBy?._id}
                        />
                    )} */}
                </div>
            )}
        </div>
    );
};

export default UserDetails;