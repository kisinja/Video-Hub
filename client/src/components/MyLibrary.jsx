import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { createPublicRequest } from "../axiosConfig";
import { BsGlobe } from "react-icons/bs";
import { LuMapPin } from "react-icons/lu";
import VideoCard from "./VideoCard";
import Spinner from "./Spinner";

const MyLibrary = ({ setActiveMenu }) => {
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

    const onlineUsers = useSelector((state) => state.user.onlineUsers);

    const isOnline = onlineUsers[user._id]?.online;

    return (
        <section className="xl:px-24 px-8 py-8">
            <h2 className="text-2xl font-light mb-6">Dashboard</h2>

            <div className="flex flex-col md:flex-row justify-between items-start pb-8 w-full gap-8">
                {/* User Info Section */}
                <div className="flex gap-6 items-center relative">
                    <div className="relative w-[120px] h-[120px]">
                        <img
                            src={imgUrl}
                            alt="User Avatar"
                            className="w-full h-full rounded-full object-cover"
                        />
                        {/* Green dot for online status */}
                        {isOnline && (
                            <span className="absolute bottom-1 right-4 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <p className="font-light text-2xl">{user.username || 'Loading...'}</p>
                        <p className="text-red-500 font-light text-lg">{user.pronouns}</p>
                        <button className="bg-blue-500 text-white py-2 px-4 rounded font-semibold focus:bg-white focus:text-black focus:ring-4 focus:ring-blue-600" onClick={() => setActiveMenu("profile")}>
                            Edit Profile
                        </button>
                    </div>
                </div>

                {/* Followers and Following Section */}
                <div className="flex flex-col items-center md:items-start">
                    <div className="flex justify-between w-full md:flex-col md:items-start">
                        <p className="text-gray-400 text-lg flex flex-col items-center md:items-start">
                            Followers
                            <span className="text-white text-2xl">{followers}</span>
                        </p>
                        <p className="text-gray-400 text-lg flex flex-col items-center md:items-start">
                            Following
                            <span className="text-white text-2xl">{following}</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Bio, Website, Location */}
            <div className="flex flex-col gap-4 mb-6">
                {user.bio && (
                    <div className="text-gray-300 font-light tracking-wider">
                        <span className="text-xs">{user.bio}</span>
                    </div>
                )}
                {user.website && (
                    <div className="flex items-center gap-2">
                        <BsGlobe className="text-xl" />
                        <a
                            href={user.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline text-sm text-red-100"
                        >
                            {user.website}
                        </a>
                    </div>
                )}
                {user.location && (
                    <div className="flex items-center gap-2">
                        <LuMapPin className="text-xl" />
                        <p className="text-gray-400 text-sm">{user.location}</p>
                    </div>
                )}
            </div>

            <hr />

            {/* Videos Section */}
            <div className="mt-6">
                <h3 className="text-xl font-light mb-6 text-center">My Videos</h3>

                {loading ? (
                    <Spinner />
                ) : (
                    userVideos.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {userVideos.map(video => (
                                <VideoCard key={video._id} video={video} showDate={true} />
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