import { useEffect, useState } from "react";
import { createPublicRequest } from "../axiosConfig";
import { useSelector } from "react-redux";
import Spinner from "../components/Spinner";
import NotificationCard from "./NotificationCard"; // Generic NotificationCard
import LikeNotificationCard from "./LikeNotificationCard"; // Like notification card
import FollowNotificationCard from "./FollowNotificationCard"; // Follow notification card
import CommentNotificationCard from "./CommentNotificationCard"; // Comment notification card
import LiveStreamNotificationCard from "./LiveStreamNotificationCard"; // New Live Stream notification card

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { currentUser } = useSelector(state => state.user);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const publicResponse = createPublicRequest(currentUser?.token);
                const response = await publicResponse.get('/notifications');

                if (response.status === 200) {
                    setNotifications(response.data);
                    setLoading(false);
                }
            } catch (error) {
                console.error(`Error: ${error.message}`);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [currentUser]);

    // Function to render the appropriate notification card based on type
    const renderNotification = (notification) => {
        switch (notification.type) {
            case 'video_viewed':
                return <LikeNotificationCard key={notification._id} notification={notification} />;
            case 'new_follow':
                return <FollowNotificationCard key={notification._id} notification={notification} />;
            case 'new_comment':
                return <CommentNotificationCard key={notification._id} notification={notification} />;
            case 'live_stream': // Handle live stream notifications
                return <LiveStreamNotificationCard key={notification._id} notification={notification} />;
            default:
                return <NotificationCard key={notification._id} notification={notification} />;
        }
    };

    return (
        <div className="p-8 bg-black text-white">
            <h1 className="text-3xl font-light mb-6">Notifications</h1>

            {loading && <Spinner />}

            {notifications && notifications.length === 0 && !loading && (
                <p className="text-gray-400">You have no new notifications.</p>
            )}

            {error && <div className="text-red-500">{error}</div>}

            <div className="flex flex-col gap-3">
                {notifications && notifications.map(notification => (
                    renderNotification(notification)
                ))}
            </div>
        </div>
    );
};

export default Notifications;