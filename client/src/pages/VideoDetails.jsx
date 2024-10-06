import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createPublicRequest } from '../axiosConfig'; // Make sure this is the correct import
import Spinner from '../components/Spinner';
import CommentSection from '../components/CommentSection';
import LikedBySection from '../components/LikedBySection';
import { useDispatch, useSelector } from 'react-redux';
import { LiaEyeSolid } from "react-icons/lia";
import UserDetails from '../components/UserDetails';
import { addToWatchHistory } from '../redux/watchHistorySlice';

const VideoDetails = () => {
    const { id } = useParams();
    const [video, setVideo] = useState(null);
    const [likes, setLikes] = useState(0);
    const [liked, setLiked] = useState(false);
    const [dislikes, setDislikes] = useState(0);
    const [disliked, setDisliked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState('');
    const [comments, setComments] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [likeAnimating, setLikeAnimating] = useState(false);
    const [dislikeAnimating, setDislikeAnimating] = useState(false);
    const [likedBy, setLikedBy] = useState([]);
    const [showLikedBy, setShowLikedBy] = useState(false);
    const [hasCountedView, setHasCountedView] = useState(false);

    const dispatch = useDispatch();

    const { currentUser } = useSelector(state => state.user);
    const userId = currentUser?._id;

    useEffect(() => {
        const fetchVideoDetails = async () => {
            setLoading(true);
            setMessage('');
            setError('');

            try {
                const publicRequest = createPublicRequest(currentUser?.token);

                const res = await publicRequest.get(`/videos/${id}`);
                if (res.status === 200) {
                    const data = res.data;
                    console.log(data);
                    setVideo(data);
                    setLikes(data.likes);
                    setDislikes(data.dislikes);
                    setLiked(data.likedBy.includes(userId));
                    setDisliked(data.dislikedBy.includes(userId));

                    // Fetch comments
                    const resComments = await publicRequest.get(`/comments/${id}`);
                    if (resComments.status === 200) {
                        setComments(resComments.data);
                    }
                } else {
                    throw new Error('Failed to fetch video details.');
                }
            } catch (error) {
                setError(error.message || 'Failed to fetch video details.');
            } finally {
                setLoading(false);
            }
        };

        fetchVideoDetails();
    }, [id, userId, currentUser?.token]);

    const handleLike = async () => {
        setLikeAnimating(true);

        try {
            const publicRequest = createPublicRequest(currentUser?.token);
            const res = await publicRequest.post(`/videos/${id}/like/`, { userId });
            if (res.status === 200) {
                setLikes(res.data.likes);
                setLiked(true);
                if (disliked) {
                    setDisliked(false);
                    setDislikes(res.data.dislikes);
                }
            }
        } catch (error) {
            console.log(error);
            setError('Failed to like the video.');
        } finally {
            setTimeout(() => setLikeAnimating(false), 300);
        }
    };

    const handleUnlike = async () => {
        setLikeAnimating(true);

        try {
            const publicRequest = createPublicRequest(currentUser?.token);
            const res = await publicRequest.post(`/videos/${id}/unlike`, { userId });
            if (res.status === 200) {
                setLikes(res.data.likes);
                setLiked(false);
            }
        } catch (error) {
            console.log(error);
            setError('Failed to unlike the video.');
        } finally {
            setTimeout(() => setLikeAnimating(false), 300);
        }
    };

    const handleDislike = async () => {
        setDislikeAnimating(true);

        try {
            const publicRequest = createPublicRequest(currentUser?.token);
            const res = await publicRequest.post(`/videos/${id}/dislike/`, { userId });
            if (res.status === 200) {
                setDislikes(res.data.dislikes);
                setDisliked(true);
                if (liked) {
                    setLiked(false);
                    setLikes(res.data.likes);
                }
            }
        } catch (error) {
            console.log(error);
            setError('Failed to dislike the video.');
        } finally {
            setTimeout(() => setDislikeAnimating(false), 300);
        }
    };

    const handleUndislike = async () => {
        setDislikeAnimating(true);

        try {
            const publicRequest = createPublicRequest(currentUser?.token);
            const res = await publicRequest.post(`/videos/${id}/undislike`, { userId });
            if (res.status === 200) {
                setDislikes(res.data.dislikes);
                setDisliked(false);
            }
        } catch (error) {
            console.log(error);
            setError('Failed to undislike the video.');
        } finally {
            setTimeout(() => setDislikeAnimating(false), 300);
        }
    };

    // Track play time
    const handleTimeUpdate = (e) => {
        const currentTime = e.target.currentTime;
        const duration = e.target.duration;

        // Count a view after the user has watched at least 30% of the video
        if (!hasCountedView && currentTime / duration >= 0.3) {

            // INCREMENT VIDEO VIEWS
            incrementView();

            // ADD TO WATCH HISTORY
            dispatch(
                /* addToWatchHistory({ ...video, watchedAt: new Date() }) */
                addToWatchHistory({ ...video, watchedAt: new Date(), user: userId })
            );

            setHasCountedView(true);
        }
    };

    // Increment view count when the condition is met
    const incrementView = async () => {
        try {
            const publicRequest = createPublicRequest(currentUser?.token);
            await publicRequest.put(`/videos/${id}/view`);
        } catch (error) {
            console.error('Error incrementing view count:', error);
        }
    };

    if (loading) return <Spinner />;

    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        if (!content.trim()) {
            setError('Comment cannot be empty!');
            return;
        }

        try {
            const publicRequest = createPublicRequest(currentUser?.token);
            const res = await publicRequest.post(`/comments/${id}`, { content });
            if (res.status === 201) {
                setMessage('Comment added...');
                setContent('');

                // Refresh the comments list
                const resComments = await publicRequest.get(`/comments/${id}`);
                if (resComments.status === 200) {
                    setComments(resComments.data);
                }
            } else {
                setError('Failed to add comment.');
            }
        } catch (error) {
            console.log(error);
            setError('An error occurred while adding the comment.');
        }
    };

    const handleLikedBy = async () => {
        setShowLikedBy(true);

        try {
            const publicRequest = createPublicRequest(currentUser?.token);
            const res = await publicRequest.get(`/videos/${id}/likedBy`);
            if (res.status === 200) {
                setLikedBy(res.data.likedBy || []);
            } else {
                setError('Failed to fetch the list of users who liked the video.');
            }
        } catch (error) {
            console.log(error);
            setError('An error occurred while fetching the list of users who liked the video.');
        }
    };

    const contextMenu = () => {

        return false;
    };

    return (
        <section className="bg-black text-white min-h-screen xl:px-24 px-4 py-4">
            <h1 className="text-white text-xl md:text-3xl font-bold mb-4 md:mb-8">
                Now Playing: <span className='italic underline text-red-300'>{video?.title || 'Loading...'}</span>
            </h1>

            <div className="max-w-4xl mx-auto">
                <div className="relative mb-6">
                    <video
                        controls
                        onContextMenu={contextMenu}
                        src={`http://localhost:3500${video?.videoUrl?.replace("//", "/")}`}
                        className="w-full h-[300px] object-cover rounded-lg"
                        onTimeUpdate={handleTimeUpdate}
                    />
                    <div className="absolute top-4 left-2 flex items-center space-x-2 bg-black right-2 bg-opacity-90 py-2 px-3">
                        <img
                            src={`http://localhost:3500${video?.thumbnailUrl?.replace("//", "/")}`}
                            alt="Thumbnail"
                            className="w-16 h-16 rounded-full border-2 border-white"
                        />
                        <div>
                            <h1 className="text-2xl font-bold">{video?.title || 'Loading...'}</h1>
                            <p className="text-gray-400">{video?.description || 'Loading...'}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800 p-4 mb-6">
                    <div className="flex justify-between mb-3 items-center px-2 divide-x divide-gray-600">
                        <UserDetails video={video} userId={userId} />

                        <LikedBySection
                            video={video}
                            handleLikedBy={handleLikedBy}
                            likedBy={likedBy}
                            liked={liked}
                            handleUnlike={handleUnlike}
                            handleLike={handleLike}
                            dislikes={dislikes}
                            handleDislike={handleDislike}
                            disliked={disliked}
                            handleUndislike={handleUndislike}
                            likeAnimating={likeAnimating}
                            dislikeAnimating={dislikeAnimating}
                            likes={likes}
                        />

                        {/* Video views */}
                        <div className='pl-4'>
                            <p className="text-white font-light flex flex-col ">
                                <span><LiaEyeSolid className='text-2xl text-red-700' /></span>
                                <span className="font-bold mx-auto">{video?.views || 'No views'}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <CommentSection comments={comments} handleCommentSubmit={handleCommentSubmit} content={content} setContent={setContent} message={message} error={error} />
            </div>
        </section>
    );
};

export default VideoDetails;