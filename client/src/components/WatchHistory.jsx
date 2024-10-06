import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearWatchHistory, selectWatchHistory, removeVideoFromWatchHistory } from "../redux/watchHistorySlice";
import VideoCard from '../components/VideoCard';
import { MdDelete } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";

const WatchHistory = () => {

    const watchHistory = useSelector(selectWatchHistory);

    const [videos, setVideos] = useState([]);

    const dispatch = useDispatch();

    const [showText, setShowText] = useState(false);

    const currentUser = useSelector(state => state.user.currentUser);

    useEffect(() => {
        const userWatchedVideos = watchHistory.find(item => item.user === currentUser._id);

        setVideos(userWatchedVideos);
    }, []);

    const handleClick = () => {
        dispatch(
            clearWatchHistory()
        );
    };

    const handleClick2 = (video) => {
        dispatch(
            removeVideoFromWatchHistory(video)
        );
    };

    const formatTime = (time) => {
        const date = new Date(time);

        return date.toLocaleTimeString();
    }

    const handleMouseEnter = () => {
        setShowText(true);
    };

    const handleMouseLeave = () => {
        setShowText(false);
    };

    return (
        <div className="px-8 xl:px-12 py-6 divide-y divide-gray-600">
            <div className=" flex justify-between items-center">
                <h1 className="text-white text-3xl font-light mb-6 tracking-wider">Watched Videos</h1>
                <p
                    className="flex items-center" onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <MdDelete
                        className="text-xl text-red-700 cursor-pointer"
                        onClick={handleClick}
                    />

                    {showText && (
                        <span className="text-xs tracking-wider bg-blue-600 py-1 px-3 rounded-xl font-semibold transition-all cursor-pointer" onClick={handleClick}>
                            Clear Watch History
                        </span>
                    )}
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-center gap-6 pt-6">
                {watchHistory && watchHistory.map(video => (
                    <div key={video._id} className="flex flex-col gap-3">
                        <VideoCard video={video} />

                        <div className="flex items-center gap-3 bg-red-900/80 text-white text-sm tracking-wider py-2 px-6 rounded transition-all">

                            <MdDeleteOutline
                                className="text-2xl text-white cursor-pointer hover:bg-black hover:w-10 hover:h-10 hover:rounded-full hover:p-2 transition-all"
                                title={`Remove "${video.title}" from watch history`}
                                onClick={() => handleClick2(video)}
                            />

                            <div className="text-left">
                                Last watched
                                <span className="italic ml-3 block">
                                    {formatTime(video.watchedAt)}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WatchHistory;