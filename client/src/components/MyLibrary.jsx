import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { createPublicRequest } from "../axiosConfig";
import { BsGlobe } from "react-icons/bs";
import { LuMapPin } from "react-icons/lu";
import VideoCard from "./VideoCard";
import Spinner from "./Spinner";

const MyLibrary = () => {
    const user = useSelector(state => state.user.currentUser);
    const [userInfo, setUserInfo] = useState(null);
    const [followers, setFollowers] = useState(0);
    const [following, setFollowing] = useState(0);
    const [userVideos, setUserVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    const imgUrl = user.avatar.startsWith('/uploads/avatar') ? `http://localhost:3500${user.avatar}` : user.avatar;

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const publicRequest = createPublicRequest(user?.token);
                const response = await publicRequest.get(`/users/${user._id}/hover`);

                if (response.status === 200) {
                    setUserInfo(response.data);
                    const { followers, following } = response.data;
                    setFollowers(followers);
                    setFollowing(following);

                    const videosResponse = await publicRequest.get(`/videos/user/${user._id}`);
                    if (videosResponse.status === 200) {
                        setUserVideos(videosResponse.data);
                    }
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [user]);

    return (
        <section className="xl:px-24 px-8 py-8">
            <h2 className="text-2xl font-light">Dashboard</h2>

            <div className="flex flex-col md:flex-row justify-between items-start pb-8 divide-y divide-red-700 w-full md:divide-y-0">
                <div className="mt-8 flex flex-col gap-5 w-full md:w-2/3">
                    <div className='flex gap-6'>
                        <img
                            src={imgUrl}
                            alt="Uploader Avatar"
                            className="w-[120px] h-[120px] rounded-full"
                        />
                        <div>
                            <p className="font-light tracking-wider text-2xl">{user.username || 'Loading...'}</p>
                            <p className="text-red-500 font-light text-lg tracking-wider">{user.pronouns}</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        {user.bio && (
                            <div className="text-gray-300 font-light tracking-wider">
                                <h3 className="text-md text-white">Bio:</h3>
                                <span className="text-xs">{user.bio}</span>
                            </div>
                        )}
                        {user.website && (
                            <div className="flex items-center gap-2">
                                <BsGlobe className="text-xl" />
                                <a href={user.website} target="_blank" rel="noopener noreferrer" className="underline tracking-wider text-sm text-red-100" title={`Visit ${user.username}'s website`}>
                                    {user.website}
                                </a>
                            </div>
                        )}
                        {user.location && (
                            <div className="flex items-center gap-2">
                                <LuMapPin className="text-xl" />
                                <p className="text-gray-400 tracking-wider text-sm">{user.location}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col mt-6 md:mt-0 md:w-1/3 w-1/2 pt-4">
                    <div className="flex flex-row justify-between w-full items-center">
                        <p className="text-gray-400 text-lg flex flex-col items-center">
                            Followers
                            <span className="text-white text-2xl">{followers}</span>
                        </p>
                        <p className="text-gray-400 text-lg flex flex-col items-center md:mt-0">
                            Following
                            <span className="text-white text-2xl">{following}</span>
                        </p>
                    </div>
                </div>

            </div>

            <hr />

            <div className="mt-6">
                <h3 className="text-xl font-light mt-8 text-center mb-6">My Videos</h3>

                {loading ? (
                    <Spinner />
                ) : (
                    userVideos.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 place-items-center gap-6">
                            {userVideos.map(video => (
                                <VideoCard key={video._id} video={video} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-600">No uploaded videos.</p>
                    )
                )}
            </div>
        </section>
    );
};

export default MyLibrary;