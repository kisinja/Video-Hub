import { useEffect, useState } from "react";
import { createPublicRequest } from "../axiosConfig";
import Spinner from "../components/Spinner";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { PiFilmSlateBold } from "react-icons/pi";
import { MdLocalMovies, MdOutlineWatchLater } from "react-icons/md";
import VideoCard from '../components/VideoCard';
import { useSelector } from "react-redux";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";

const VideosList = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [videosPerPage] = useState(6);
    const [activeCategory, setActiveCategory] = useState('All');
    const [categories, setCategories] = useState([
        {
            id: 1,
            name: 'All',
            icon: <PiFilmSlateBold />
        },
        {
            id: 2,
            name: 'Movies',
            icon: <MdLocalMovies />
        },
        {
            id: 3,
            name: 'Subscribed',
            icon: <MdOutlineWatchLater />
        }
    ]); // Example categories
    const [searchTerm, setSearchTerm] = useState(""); // New state to track search input

    const token = useSelector(state => state.user.currentUser?.token);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const publicRequest = createPublicRequest(token); // Get the Axios instance
                const res = await publicRequest.get(`/videos`);
                if (res.status === 200) {
                    const data = res.data;
                    console.log(data);
                    setVideos(data);
                    setLoading(false);
                } else {
                    console.log(res.data.error);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchVideos();
    }, [activeCategory, token]);

    // Filter videos based on search term
    const filteredVideos = videos.filter((video) =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination logic
    const indexOfLastVideo = currentPage * videosPerPage;
    const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
    const currentVideos = filteredVideos.slice(indexOfFirstVideo, indexOfLastVideo);

    const handlePageChange = (direction) => {
        setCurrentPage(prevPage => direction === 'next' ? prevPage + 1 : prevPage - 1);
    };

    return (
        <div className="bg-black text-white flex justify-between flex-col gap-5">

            <div className="w-full relative">
                <HiOutlineMagnifyingGlass className="text-3xl text-gray-400 absolute top-3 left-3" />

                <input
                    type="text"
                    placeholder="What you tryna watch..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full py-3 px-14 bg-transparent border-2 border-gray-600 rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-700 focus:border-white placeholder:text-lg"
                />
            </div>

            {/* Sidebar */}
            <div className="flex justify-between">
                <aside className="w-64 bg-gray-900 p-5 space-y-4">
                    <h2 className="text-xl font-bold mb-4">Categories</h2>
                    <ul className="">
                        {categories.map(category => (
                            <li key={category.id}>
                                <button
                                    onClick={() => setActiveCategory(category.name)}
                                    className={`w-full text-left p-2 rounded flex gap-2 items-center mb-3 ${activeCategory === category.name ? 'bg-red-600' : 'bg-gray-800'} text-white`}
                                >
                                    <span className={`text-2xl ${activeCategory === category.name ? 'bg-red-600' : 'bg-gray-800'} text-white`}>{category.icon}</span>
                                    {category.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-5 md:ml-12">
                    <h1 className="text-3xl font-light mb-4 flex justify-between items-center">
                        Watch

                        <span className="text-yellow-300 text-sm">
                            {filteredVideos.length} videos found
                        </span>
                    </h1>

                    {loading ? (
                        <Spinner />
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {currentVideos.map(video => (
                                    <VideoCard key={video._id} video={video} showDate={true} />
                                ))}
                            </div>

                            {/* Pagination */}
                            <div className="flex justify-between items-center mt-8">
                                <button
                                    onClick={() => handlePageChange('prev')}
                                    disabled={currentPage === 1}
                                    className="text-white hover:text-red-800 disabled:opacity-50"
                                >
                                    <FaChevronLeft />
                                </button>
                                <span className="text-white">Page {currentPage}</span>
                                <button
                                    onClick={() => handlePageChange('next')}
                                    disabled={currentPage * videosPerPage >= filteredVideos.length}
                                    className="text-white hover:text-red-800 disabled:opacity-50"
                                >
                                    <FaChevronRight />
                                </button>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default VideosList;