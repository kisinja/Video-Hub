const LiveStreamNotificationCard = ({ notification }) => {
    return (
        <div className="p-4 border border-red-500 bg-gray-800 rounded">
            <p className="text-red-300">{notification.content}</p>
            <a href={`/live/${notification.roomId}`} className="text-blue-400 hover:underline">
                Join Live Stream
            </a>
        </div>
    );
};

export default LiveStreamNotificationCard;