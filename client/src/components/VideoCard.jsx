import { Link } from "react-router-dom";
import { formatDate } from "../formatDate";
import { useState } from "react";
import { useSelector } from "react-redux";
import { IoEye } from "react-icons/io5";
import { FaRegComment, FaThumbsUp } from "react-icons/fa";

const VideoCard = ({ video, showDate }) => {

    const [isFocused, setIsFocused] = useState(false);

    const handleCardClick = () => {
        setIsFocused(true);

        //Optionally, you can clear the focus after some time or after navigation.

        setTimeout(() => setIsFocused(false), 3000);
    };

    const imgStyles = {
        // background linear gradient
        background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5))`,
    };

    const user = useSelector(state => state.user.currentUser);

    return (
        <Link to={`/watch/video/${video._id}`} className={`group block focus:outline-none relative rounded-lg overflow-hidden shadow-md md:shadow-lg transition-all duration-300 ease-in-out hover:shadow-red-600 w-full ${isFocused ? 'shadow-lg shadow-red-600 ring-4 ring-red-600 ring-opacity-50' : ''}`} onClick={handleCardClick}>
            <div className="rounded-lg overflow-hidden shadow-lg relative" key={video._id}>
                {/* Thumbnail section */}
                <div className="md:h-[350px] h-56 w-full relative ">
                    <img
                        src={`http://localhost:3500${video.thumbnailUrl}`}
                        alt={video.title}
                        className="w-full h-full object-cover"
                        style={imgStyles}
                    />
                    {/* Created At Badge */}
                    {showDate && (
                        <div className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-bl-lg text-xs md:text-sm md:p-2">
                            {formatDate(video.createdAt)}
                        </div>
                    )}
                </div>

                {/* Details section that shows on hover */}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 p-2 transform translate-y-full group-hover:translate-y-0 transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100">
                    <h3 className="text-xs md:text-lg font-semibold text-white tracking-wider">{video.title}</h3>
                    {/* <p className="text-gray-400 mt-1 text-xs  md:text-sm tracking-wider">{video.description}</p> */}

                    {/* Additional details like views and uploader */}
                    <div className="mt-2 flex justify-between items-center">
                        {/* <p className="text-blue-200 text-[10px] md:text-xs tracking-wider">
                            Uploaded by: <span className="font-bold text-white">{video.uploadedBy.username === user.username ? 'Me' : video.uploadedBy.username}</span>
                        </p> */}
                        <div className="text-center">
                            <IoEye className="text-xl text-red-600/90" />
                            <p className="text-white text-sm tracking-wider">{video.views}</p>
                        </div>

                        <div className="text-center">
                            <FaRegComment className="text-xl text-red-600/90" />
                            <p className="text-white text-sm tracking-wider">{video.comments.length}</p>
                        </div>

                        <div className="text-center">
                            <FaThumbsUp
                                className="text-xl text-red-600/90"
                            />
                            <span className='text-white text-sm'>{video.likes}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default VideoCard;