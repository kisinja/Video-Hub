import { Link } from 'react-router-dom';

const LikeNotificationCard = ({ notification }) => {

    const imgUrl = notification.triggeredBy?.avatar.startsWith('/uploads/avatars')
        ? `http://localhost:3500${notification.triggeredBy.avatar}`  // Fetch from server if it's a custom avatar
        : notification.triggeredBy.avatar;

    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg hover:bg-gray-700 transition-all duration-300 flex items-center space-x-4">
            {/* Avatar of the user who liked the content */}
            <img
                src={imgUrl}
                alt={notification.triggeredBy.username}
                className="w-12 h-12 rounded-full"
            />

            {/* Notification Content */}
            <div className="flex-1">
                <p className="text-white font-semibold">
                    <Link to={`/profile/${notification.triggeredBy._id}`} className="hover:underline">
                        {notification.triggeredBy.username}
                    </Link>
                    &nbsp;
                    liked your video.
                </p>
                <p className="text-gray-400 text-sm mt-1">
                    {new Date(notification.createdAt).toLocaleTimeString()}
                </p>
            </div>

            {/* View Post Button */}
            <Link
                to={`/post/${notification.contentId}`}
                className="text-red-500 font-bold hover:text-red-400"
            >
                View
            </Link>
        </div>
    );
};

export default LikeNotificationCard;