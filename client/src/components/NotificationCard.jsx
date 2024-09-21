import { Link } from 'react-router-dom';

const NotificationCard = ({ notification }) => {
    const renderNotificationContent = () => {
        switch (notification.type) {
            case 'like':
                return (
                    <p className="text-white">
                        <Link to={`/profile/${notification.triggeredBy._id}`} className="font-bold hover:underline">
                            {notification.triggeredBy.username}
                        </Link>
                        &nbsp;
                        liked your
                        &nbsp;
                        <Link to={`/watch/video/${notification.video._id}`} className="font-bold hover:underline text-red-500">
                            video
                        </Link>.
                    </p>
                );
            case 'follow':
                return (
                    <p className="text-white">
                        <Link to={`/profile/${notification.triggeredBy._id}`} className="font-bold hover:underline">
                            {notification.triggeredBy.username}
                        </Link>
                        started following you.
                    </p>
                );
            case 'new_comment':
                return (
                    <p className="text-white">
                        <Link to={`/profile/${notification.triggeredBy._id}`} className="font-bold hover:underline">
                            {notification.triggeredBy.username}
                        </Link>
                        commented on your
                        <Link to={`/post/${notification.contentId}`} className="font-bold hover:underline text-green-500">
                            post
                        </Link>: {'"'}{notification.commentText.slice(0, 30)}...{'"'}
                    </p>
                );
            default:
                return <p className="text-white">You have a new notification.</p>;
        }
    };

    const imgUrl = notification.triggeredBy?.avatar.startsWith('/uploads/avatars')
        ? `http://localhost:3500${notification.triggeredBy.avatar}`  // Fetch from server if it's a custom avatar
        : notification.triggeredBy.avatar;

    return (
        <div className="bg-gray-900 p-4 rounded-lg shadow-lg hover:bg-gray-700 transition-all duration-300 flex items-center space-x-4">
            {/* Avatar of the user who triggered the notification */}
            <img
                src={imgUrl}
                alt={notification.triggeredBy.username}
                className="w-12 h-12 rounded-full"
            />

            {/* Notification Content */}
            <div className="flex-1">
                {renderNotificationContent()}
                <p className="text-gray-400 text-sm mt-1">
                    {new Date(notification.createdAt).toLocaleString()}
                </p>
            </div>

            {/* Optional Action Link based on notification type */}
            {notification.type === 'like' && (
                <Link
                    to={`/post/${notification.contentId}`}
                    className="text-red-500 font-bold hover:text-red-400"
                >
                    View
                </Link>
            )}
            {notification.type === 'follow' && (
                <Link
                    to={`/profile/${notification.triggeredBy._id}`}
                    className="text-blue-500 font-bold hover:text-blue-400"
                >
                    View Profile
                </Link>
            )}
            {notification.type === 'comment' && (
                <Link
                    to={`/post/${notification.contentId}`}
                    className="text-green-500 font-bold hover:text-green-400"
                >
                    View Comment
                </Link>
            )}
        </div>
    );
};

export default NotificationCard;