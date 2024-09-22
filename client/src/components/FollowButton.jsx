import { useState, useEffect } from 'react';
import { createPublicRequest } from '../axiosConfig';
import { useSelector } from 'react-redux';

const FollowButton = ({ userId, targetUserId }) => {
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(false);

    const token = useSelector(state => state.user.currentUser?.token);

    const user = useSelector(state => state.user.currentUser);

    // Creating axios instance with token
    const publicRequest = createPublicRequest(token);

    useEffect(() => {
        // Fetch the initial follow status
        const fetchFollowStatus = async () => {
            try {
                const response = await publicRequest.get(`/users/${userId}/following/${targetUserId}`);
                console.log(response.data);
                setIsFollowing(response.data.isFollowing);
            } catch (error) {
                console.error('Failed to fetch follow status', error);
            }
        };

        fetchFollowStatus();
    }, [userId, targetUserId]);

    const handleFollowToggle = async () => {
        setLoading(true);
        try {
            const endpoint = isFollowing ? 'unfollow' : 'follow';
            const response = await publicRequest.post(`/users/${targetUserId}/${endpoint}`);
            if (response.status === 200) {
                console.log(response.data);
                setIsFollowing(!isFollowing);
            }
        } catch (error) {
            console.error(`Failed to ${isFollowing ? 'unfollow' : 'follow'}`, error);
        } finally {
            setLoading(false);
        }
    };

    if (user._id === targetUserId) {
        return null;
    };

    return (
        <button
            onClick={handleFollowToggle}
            disabled={loading}
            className={`py-2 px-3 rounded text-sm font-semibold ${isFollowing ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'} `}
        >
            {loading ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
        </button>
    );
};

export default FollowButton;