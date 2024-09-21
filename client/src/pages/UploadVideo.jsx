import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { createPublicRequest } from "../axiosConfig";
import { useSelector } from "react-redux";

const UploadVideo = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [videoUrl, setVideoUrl] = useState(null);
    const [thumbnailUrl, setThumbnailUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const token = useSelector(state => state.user.currentUser?.token);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        if (videoUrl) formData.append('videoUrl', videoUrl);
        if (thumbnailUrl) formData.append('thumbnailUrl', thumbnailUrl);

        try {
            const publicRequest = createPublicRequest(token);
            const res = await publicRequest.post('/videos/upload', formData);
            if (res.status === 200) {
                setMessage(res.data.message);
            } else {
                setError(res.data.error);
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const publicRequest = createPublicRequest(token);
                const res = await publicRequest.get('/videos');
                if (res.status !== 200) {
                    setError(res.data.error);
                }
            } catch (error) {
                setError(error.message);
            }
        };

        fetchVideos();
    }, []);

    const { getRootProps: getVideoRootProps, getInputProps: getVideoInputProps } = useDropzone({
        accept: 'video/*',
        onDrop: (acceptedFiles) => setVideoUrl(acceptedFiles[0]),
    });

    const { getRootProps: getThumbnailRootProps, getInputProps: getThumbnailInputProps } = useDropzone({
        accept: 'image/*',
        onDrop: (acceptedFiles) => setThumbnailUrl(acceptedFiles[0]),
    });

    return (
        <section className="bg-gray-900 min-h-screen flex flex-col items-center justify-center py-10">
            <h1 className="text-3xl font-bold text-white mb-6">Upload Your Video</h1>

            <form className="max-w-lg w-full p-8 bg-gray-800 rounded-lg shadow-lg" onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label htmlFor="title" className="block text-lg text-gray-200 mb-2">Video Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border border-gray-600 rounded px-4 py-3 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Enter video title"
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="description" className="block text-lg text-gray-200 mb-2">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border border-gray-600 rounded px-4 py-3 bg-gray-700 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
                        rows="4"
                        placeholder="Write a brief description..."
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="video" className="block text-lg text-gray-200 mb-2">Upload Video</label>
                    <div
                        {...getVideoRootProps()}
                        className="border-2 border-dashed border-white rounded px-4 py-3 bg-gray-700 text-white cursor-pointer flex items-center justify-center hover:bg-gray-600 transition-all"
                    >
                        <input {...getVideoInputProps()} id="video" />
                        <p className="text-gray-400">{videoUrl ? videoUrl.name : 'Drag & drop video file here, or click to select'}</p>
                    </div>
                </div>

                <div className="mb-6">
                    <label htmlFor="thumbnail" className="block text-lg text-gray-200 mb-2">Upload Thumbnail</label>
                    <div
                        {...getThumbnailRootProps()}
                        className="border-2 border-dashed border-white rounded px-4 py-3 bg-gray-700 text-white cursor-pointer flex items-center justify-center hover:bg-gray-600 transition-all"
                    >
                        <input {...getThumbnailInputProps()} id="thumbnail" />
                        <p className="text-gray-400">{thumbnailUrl ? thumbnailUrl.name : 'Drag & drop image file here, or click to select'}</p>
                    </div>
                </div>

                {error && <div className="mb-4 bg-red-600 text-white p-3 rounded">{error}</div>}
                {message && <div className="mb-4 bg-green-600 text-white p-3 rounded">{message}</div>}

                <div className="flex justify-center">
                    <button
                        className={`w-full bg-red-600 font-semibold py-3 rounded text-white hover:bg-red-500 transition-all ${loading ? 'bg-red-700' : ''}`}
                        type='submit'
                        disabled={loading}
                    >
                        {loading ? 'Uploading...' : 'Upload Video'}
                    </button>
                </div>
            </form>
        </section>
    );
};

export default UploadVideo;