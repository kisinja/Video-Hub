import { Link } from 'react-router-dom';

const CommentNotificationCard = ({ notification }) => {

    const imgUrl = notification.triggeredBy?.avatar.startsWith('/uploads/avatars')
        ? `http://localhost:3500${notification.triggeredBy.avatar}`  // Fetch from server if it's a custom avatar
        : notification.triggeredBy.avatar;

    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg hover:bg-gray-700 transition-all duration-300 flex items-center space-x-4">
            {/* Avatar of the user who commented */}
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
                    commented on your post: {'"'}{notification.commentText.slice(0, 20)}...{'"'}
                </p>
                <p className="text-gray-400 text-sm mt-1">
                    {new Date(notification.createdAt).toLocaleDateString()}
                </p>
            </div>

            {/* View Comment Button */}
            <Link
                to={`/post/${notification.contentId}`}
                className="text-green-500 font-bold hover:text-green-400"
            >
                View Comment
            </Link>
        </div>
    );
};

export default CommentNotificationCard;