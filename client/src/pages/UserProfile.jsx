import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createPublicRequest } from '../axiosConfig';
import { useSelector } from 'react-redux';
import VideoCard from '../components/VideoCard';
import { LuMapPin } from 'react-icons/lu';
import { BsGlobe } from 'react-icons/bs';
import Spinner from '../components/Spinner';
import FollowButton from '../components/FollowButton';

const UserProfile = () => {

    const { userId } = useParams();
    const [userInfo, setUserInfo] = useState(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = useSelector(state => state.user.currentUser.token);

    const onlineUsers = useSelector((state) => state.user.onlineUsers);

    const currentUser = useSelector(state => state.user.currentUser);

    useEffect(() => {
        // Fetch user profile
        const fetchUserProfile = async () => {
            try {
                const publicRequest = createPublicRequest(token);
                const res = await publicRequest.get(`/users/profile/${userId}`);
                if (res.status === 200) {
                    setUserInfo(res.data);
                    console.log(res.data);

                    // Fetch user videos
                    const videosRes = await publicRequest.get(`/videos/user/${userId}`);
                    if (videosRes.status === 200) {
                        setVideos(videosRes.data);
                        setLoading(false);
                    }
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [userId, token]);

    if (loading) {
        return <Spinner />;
    }


    const isOnline = onlineUsers[userInfo._id];

    return (
        <>
            <center>
                <h1 className="font-light text-white text-4xl tracking-wider">User Profile</h1>
            </center>

            <section className="xl:px-24 px-8 py-8 flex justify-center items-center">

                <div className="flex flex-col gap-6 md:w-[90%]">
                    <div className=''>
                        <div className='flex justify-between'>
                            <div className='flex flex-col gap-6'>
                                <div className='flex gap-8 '>
                                    <div className="relative w-[120px] h-[120px]">
                                        <img
                                            src={userInfo?.avatar.startsWith('/uploads/avatar') ? `http://localhost:3500${userInfo.avatar}` : userInfo.avatar}
                                            alt="User Avatar"
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                        {isOnline && (
                                            <span className="absolute bottom-1 right-4 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <p className="font-light text-2xl text-white">{userInfo?.username || 'Loading...'}</p>
                                        <p className="text-red-500 font-light text-lg">{userInfo?.pronouns}</p>

                                        <FollowButton targetUserId={userInfo._id} userId={currentUser._id} />
                                    </div>
                                </div>

                                <div className='flex flex-col space-y-2'>
                                    {userInfo?.bio && (
                                        <div className="text-gray-300 font-light tracking-wider">
                                            <span className="text-base">{userInfo.bio}</span>
                                        </div>
                                    )}
                                    {userInfo?.website && (
                                        <div className="flex items-center gap-2">
                                            <BsGlobe className="text-xl text-white" />
                                            <a
                                                href={userInfo.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="underline text-sm text-red-100"
                                            >
                                                {userInfo.website}
                                            </a>
                                        </div>
                                    )}
                                    {userInfo?.location && (
                                        <div className="flex items-center gap-2">
                                            <LuMapPin className="text-xl text-white" />
                                            <p className="text-gray-400 text-sm">{userInfo.location}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-12">
                                <div className="">
                                    <p className="text-white text-lg font-medium text-center">{userInfo?.followers?.length || 0}</p>
                                    <p className="text-gray-400 text-sm">Followers</p>
                                </div>
                                <div className="">
                                    <p className="text-white text-lg font-medium text-center">{userInfo?.following?.length || 0}</p>
                                    <p className="text-gray-400 text-sm">Following</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="w-full border-gray-600" />

                    {/* User Videos */}
                    <div className="mt-6 w-full">
                        <h3 className="text-xl font-light mb-6 text-center text-white">Uploaded Videos</h3>
                        {videos?.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {videos.map((video) => (
                                    <VideoCard key={video._id} video={video} showDate={true} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-600">No uploaded videos.</p>
                        )}
                    </div>
                </div>
            </section>
        </>

    );
};

export default UserProfile;