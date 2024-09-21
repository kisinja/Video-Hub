import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { createPublicRequest } from '../axiosConfig';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfileSuccess } from '../redux/userSlice';
import { CiEdit } from "react-icons/ci";

const Profile = () => {

    const user = useSelector(state => state.user.currentUser);

    const [formData, setFormData] = useState({
        username: user.username,
        email: user.email,
        age: user.age || '',
        location: user.location || '',
        bio: user.bio || '',
        website: user.website || '',
        pronouns: user.pronouns || '',
    });

    console.log(user);

    const token = useSelector((state) => state.user.currentUser?.token);
    const [avatar, setAvatar] = useState(null);

    const [preview, setPreview] = useState(
        user.avatar.startsWith('/uploads/avatars')
            ? `http://localhost:3500${user.avatar}`  // Fetch from server for custom avatar
            : user.avatar  // Use the default avatar URL
    );

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles) => {
            const file = acceptedFiles[0];
            if (file) {
                setAvatar(file);
                setPreview(URL.createObjectURL(file));
            }
        },
        accept: {
            'image/jpeg': ['.jpeg', '.jpg'],
            'image/png': ['.png'],
            'image/gif': ['.gif'],
        },
        multiple: false,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        console.log(formData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');
        const data = new FormData();

        data.append('username', formData.username);
        data.append('email', formData.email);
        data.append('age', formData.age);
        data.append('location', formData.location);
        data.append('bio', formData.bio);
        data.append('website', formData.website);
        data.append('pronouns', formData.pronouns);
        if (avatar) {
            data.append('avatar', avatar); // Ensure this matches multer configuration
        }

        try {
            const publicRequest = createPublicRequest(token);
            const response = await publicRequest.put('/users/update', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                console.log(response.data);
                setLoading(false);
                // Update user profile in Redux store
                dispatch(
                    updateProfileSuccess(
                        response.data.user
                    )
                );

                setMessage(response.data.message);
            } else {
                console.log(response.data);
                setError(response.data.error);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setError("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-light text-white mb-6 flex gap-2 items-center">
                Edit Profile

            </h1>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-400">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full border border-gray-600 rounded px-4 py-2 bg-gray-800 text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border border-gray-600 rounded px-4 py-2 bg-gray-800 text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400">Age</label>
                        <input
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            className="w-full border border-gray-600 rounded px-4 py-2 bg-gray-800 text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full border border-gray-600 rounded px-4 py-2 bg-gray-800 text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400">Website</label>
                        <input
                            type="url"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            className="w-full border border-gray-600 rounded px-4 py-2 bg-gray-800 text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400">Pronouns</label>
                        <input
                            type="text"
                            name="pronouns"
                            value={formData.pronouns}
                            onChange={handleChange}
                            className="w-full border border-gray-600 rounded px-4 py-2 bg-gray-800 text-white"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-gray-400">Bio</label>
                    <textarea
                        type="text"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className="w-full border border-gray-600 rounded px-4 py-2 bg-gray-800 text-white"
                    />
                </div>

                {/* Avatar Dropzone */}
                <div className="mt-6">
                    <label className="block text-gray-400 mb-2">
                        Avatar
                    </label>
                    <div {...getRootProps({ className: 'dropzone border-2 border-dashed border-gray-300 p-4 text-center rounded' })}>
                        <input {...getInputProps()} />
                        {preview ? (
                            <div>
                                <img src={preview} alt="avatar preview" className="mx-auto h-[120px] w-[120px] rounded-full" />

                                <button className="text-blue-400 text-3xl mt-2">
                                    <CiEdit className='bg-gray-700 p-1' title='Change avatar' />
                                </button>
                            </div>
                        ) : (
                            <p className="text-gray-400">Drag & drop your avatar here, or click to select</p>
                        )}
                    </div>
                </div>

                <div className="mt-6 flex justify-center items-center">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-yellow-400 text-white rounded hover:bg-yellow-600 focus:outline-none focus:ring-4 focus:ring-blue-600 focus:border-2 focus:border-black focus:bg-white focus:text-black"
                    >
                        {
                            loading ? 'Loading...' : 'Update Profile'
                        }
                    </button>
                </div>

                {error && <div className='error'>{error}</div>}
                {message && <div className='message'>{message}</div>}
            </form>
        </div>
    );
};

export default Profile;