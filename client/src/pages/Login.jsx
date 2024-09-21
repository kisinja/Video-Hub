import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createUserRequest } from "../axiosConfig";
import { loginFailure, loginSuccess } from "../redux/userSlice";
import Spinner from "../components/Spinner";

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState('');

    const dispatch = useDispatch();
    const token = useSelector(state => state.user.currentUser?.token); // Get token from Redux state

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
            const userRequest = createUserRequest(token);

            // Making POST request for login
            const response = await userRequest.post('/login', formData);
            const data = response.data;

            if (response.status === 201) {
                // Dispatch login success
                dispatch(loginSuccess(data));

                // Store user data in local storage
                localStorage.setItem("currentUser", JSON.stringify(data));

                setMessage('Login successful');
            } else {
                // Dispatch login failure
                dispatch(loginFailure());

                setError(data.error || 'Login failed');
            }
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.error || error.message || 'An error occurred');
        } finally {
            setLoading(false);
        }

        // Clear form data
        setFormData({
            email: '',
            password: '',
        });
    };

    return (
        <section className="flex items-center justify-center min-h-screen" id="login">
            <div className="px-8 py-4 rounded-lg shadow-lg max-w-md w-full bg-gray-950/95">
                <h2 className="text-white text-3xl mb-6 font-light">Sign In</h2>

                {/* Form section */}
                <form onSubmit={handleSubmit}>
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
                        Sign In
                    </button>

                    {/* Loading, Message and Error displays */}
                    {loading && <Spinner />}

                    {error && <div className="mt-4 error">{error}</div>}

                    {message && <div className="mt-4 message">{message}</div>}

                    <div className="mt-6">
                        <p className="text-gray-300 text-sm">
                            Don&apos;t have an account? <a href="/signup" className="text-red-500">Register</a>
                        </p>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default Login;