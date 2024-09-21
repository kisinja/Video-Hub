import { useState } from 'react';
import { createPublicRequest, createUserRequest } from '../axiosConfig';
import Spinner from '../components/Spinner';
import { loginSuccess, loginFailure } from '../redux/userSlice';
import { useDispatch, useSelector } from 'react-redux';

const SignUp = () => {

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState('');

    const dispatch = useDispatch();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage('');
        try {

            // Creating axios instance with token
            const publicRequest = createUserRequest();

            const res = await publicRequest.post('/signup', formData);

            if (res.status === 201) {
                console.log(res.data);

                // dispatch login success
                dispatch(loginSuccess(res.data));

                // store user data in local storage
                localStorage.setItem("currentUser", JSON.stringify(res.data));
                setMessage('Registration successful');
                setLoading(false);
            } else {

                // dispatch login failure
                dispatch(loginFailure());

                console.log(res.data.error);
                setError(res.data.error);
                setLoading(false);
            }

            // clear form data
            setFormData({
                username: '',
                email: '',
                password: '',
            });
        } catch (error) {
            console.log(error);
            setError(error.response.data.error);
        } finally {
            setLoading(false);
        };
    };

    return (
        <section className="flex items-center justify-center min-h-screen" id='signup'>
            <div className="px-8 py-4 rounded-lg shadow-lg max-w-md w-full bg-gray-950/95">
                <h2 className="text-white text-3xl mb-6 font-light">Sign Up</h2>

                {/* Form section */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-gray-300 text-sm mb-2">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                            placeholder="Enter your username"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-300 text-sm mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-300 text-sm mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-red-700 hover:bg-red-600 text-white py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
                        disabled={loading}
                    >
                        Sign Up
                    </button>

                    {/* Loading, Message and Error displays */}
                    {loading && <Spinner />}

                    {error && <div className="error mt-4">{error}</div>}

                    {message && <div className="message mt-4">{message}</div>}

                    <div className="text-center mt-6">
                        <p className="text-gray-300">Already have an account? <a href="/login" className="text-red-500">Sign In</a></p>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default SignUp;