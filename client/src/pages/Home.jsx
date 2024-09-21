import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createPublicRequest } from '../axiosConfig';
import VideoCard from '../components/VideoCard';
import Spinner from '../components/Spinner';
import { FaFilm, FaGamepad, FaMusic, FaPhotoVideo } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const Home = () => {
    const [featuredVideos, setFeaturedVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = useSelector(state => state.user.currentUser?.token);

    useEffect(() => {
        const getFeaturedVideos = async () => {
            try {
                const publicRequest = createPublicRequest(token);
                const res = await publicRequest.get('/videos/featured');

                if (res.status === 200) {
                    setFeaturedVideos(res.data);
                    setLoading(false);
                } else {
                    console.error(res.data.error);
                    setLoading(false);
                }
            } catch (error) {
                console.error(error.message);
                setLoading(false);
            }
        };

        getFeaturedVideos();
    }, []);

    return (
        <div className="bg-black text-white">
            {/* Hero Section */}
            <section className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-black via-gray-900 to-black">
                <div className="text-center">
                    <h1 className="text-5xl font-bold mb-4">Welcome to VideoStream</h1>
                    <p className="text-lg mb-8">Discover, watch, and share your favorite videos with ease.</p>
                    <Link to="/upload">
                        <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded">
                            Upload Video
                        </button>
                    </Link>
                </div>
            </section>

            {/* How-To Section */}


            {/* Featured Videos Section */}
            <section className="py-16 px-4">
                <h2 className="text-3xl font-semibold text-center text-white mb-8">Featured Videos</h2>
                {loading ? (
                    <Spinner />
                ) : (
                    <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredVideos.map((video) => (
                            <VideoCard video={video} key={video._id} />
                        ))}
                    </div>
                )}
            </section>

            {/* Upload Section */}
            <section className="bg-gray-800 py-16 px-4">
                <div className="text-center">
                    <h2 className="text-3xl font-semibold text-white mb-4">Easy Upload</h2>
                    <p className="text-gray-300 mb-8">Upload your videos quickly and effortlessly. Share your creativity with the world!</p>
                    <Link to="/upload">
                        <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded">
                            Start Uploading
                        </button>
                    </Link>
                </div>
            </section>

            {/* Video Types Section */}
            <section className="py-16 px-4">
                <h2 className="text-3xl font-semibold text-center text-white mb-8">Explore Our Video Types</h2>
                <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {/* Example Video Types */}
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
                        <FaFilm className="text-red-600 text-5xl mb-4 mx-auto" />
                        <h3 className="text-xl font-semibold text-white">Movies</h3>
                        <p className="text-gray-400 mt-2">Enjoy a wide range of movies from different genres and eras.</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
                        <FaMusic className="text-red-600 text-5xl mb-4 mx-auto" />
                        <h3 className="text-xl font-semibold text-white">Music Videos</h3>
                        <p className="text-gray-400 mt-2">Discover the latest music videos and your favorite artists.</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
                        <FaGamepad className="text-red-600 text-5xl mb-4 mx-auto" />
                        <h3 className="text-xl font-semibold text-white">Gaming</h3>
                        <p className="text-gray-400 mt-2">Watch gameplay, tutorials, and eSports events.</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
                        <FaPhotoVideo className="text-red-600 text-5xl mb-4 mx-auto" />
                        <h3 className="text-xl font-semibold text-white">Short Clips</h3>
                        <p className="text-gray-400 mt-2">Browse through a variety of short, entertaining clips.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;