import { useState } from 'react';
import Modal from './Modal'; // Assuming you have a Modal component
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const LikedBySection = ({
    video,
    handleLikedBy,
    likedBy,
    liked,
    handleUnlike,
    handleLike,
    dislikes,
    handleDislike,
    disliked,
    handleUndislike,
    likeAnimating,
    dislikeAnimating,
    likes
}) => {
    const [showLikedByModal, setShowLikedByModal] = useState(false);

    const handleShowLikedByModal = async () => {
        try {
            await handleLikedBy();
            setShowLikedByModal(true);
        } catch (error) {
            console.error('Failed to fetch likedBy data:', error);
        }
    };

    const handleCloseModal = () => {
        setShowLikedByModal(false);
    };

    // Retrieve online users from Redux state
    const onlineUsers = useSelector((state) => state.user.onlineUsers);

    return (
        <div className='flex pt-3 justify-between divide-x divide-red-500'>
            <div className="flex flex-col gap-2 pl-4">
                <div className='flex items-center justify-between'>
                    {/* Thumbs Up (Like) Button */}
                    <button
                        className="flex items-center space-x-3"
                        onClick={liked ? handleUnlike : handleLike}
                    >
                        <FaThumbsUp
                            className={`like-btn ${liked ? 'text-red-700' : 'text-gray-400'} ${likeAnimating ? 'scale-up' : 'scale-down'}`}
                        />
                        <span className='text-gray-300'>{likes}</span>
                    </button>

                    {/* Thumbs Down (Dislike) Button */}
                    <button
                        className="flex items-center space-x-3"
                        onClick={disliked ? handleUndislike : handleDislike}
                    >
                        <FaThumbsDown
                            className={`dislike-btn ${disliked ? 'text-red-500' : 'text-gray-400'} ${dislikeAnimating ? 'scale-up' : 'scale-down'}`}
                        />
                        <span className='text-gray-300'>{dislikes}</span>
                    </button>
                </div>

                <p className="text-gray-300 tracking-wider text-sm">
                    Liked by
                    &nbsp;
                    <span
                        className='underline hover:italic cursor-pointer text-yellow-400'
                        onClick={handleShowLikedByModal}
                        title='See who liked this video'
                    >
                        {video.likedBy.length} streamers
                    </span>
                </p>
            </div>

            {/* Modal for Liked By Section */}
            {showLikedByModal && (
                <Modal onClose={handleCloseModal}>
                    <h3 className='text-xl font-light mb-4 text-white'>Liked By</h3>
                    <div className='flex flex-col gap-2'>
                        {likedBy.length > 0 ? (
                            likedBy.map((user) => {
                                const isOnline = onlineUsers[user._id]; // Check if the current user is online
                                return (
                                    <Link to={`/user-profile/${user._id}`} key={user._id}>
                                        <div className='flex items-center gap-2'>
                                            <div className="relative">
                                                <img
                                                    src={
                                                        user.avatar.startsWith('/uploads/avatars')
                                                            ? `http://localhost:3500${user.avatar}`
                                                            : user.avatar
                                                    }
                                                    alt="User Avatar"
                                                    className="w-12 h-12 rounded-full"
                                                />
                                                {isOnline && (
                                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-3 border-white" />
                                                )}
                                            </div>
                                            <p className='text-gray-500'>{user.username}</p>
                                        </div>
                                    </Link>
                                );
                            })
                        ) : (
                            <p>No users have liked this video yet.</p>
                        )}
                    </div>
                    <div className='flex justify-center items-center'>
                        <button
                            onClick={handleCloseModal}
                            className="mt-4 bg-red-800 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-900 transition duration-200"
                        >
                            Close
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default LikedBySection;