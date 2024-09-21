import { useEffect, useState } from "react";
import { createPublicRequest } from "../axiosConfig";
import { useSelector } from "react-redux";
import Spinner from "../components/Spinner";
import NotificationCard from "./NotificationCard"; // Assuming a generic NotificationCard
import LikeNotificationCard from "./LikeNotificationCard"; // New Like notification card
import FollowNotificationCard from "./FollowNotificationCard"; // New Follow notification card
import CommentNotificationCard from "./CommentNotificationCard"; // New Comment notification card

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
            default:
                return <NotificationCard key={notification._id} notification={notification} />; // Generic card for other types
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-light text-white mb-6">Notifications</h1>

            {loading && <Spinner />}

            {notifications && notifications.length === 0 && !loading && (
                <p className="text-gray-400">You have no new notifications.</p>
            )}

            {error && <div className="error">{error}</div>}

            <div className="flex flex-col gap-3">
                {notifications && notifications.map(notification => (
                    renderNotification(notification)
                ))}
            </div>
        </div>
    );
};

export default Notifications;