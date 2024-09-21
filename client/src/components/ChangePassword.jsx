import { useState } from "react";
import { createPublicRequest } from "../axiosConfig";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/userSlice";

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.currentUser);

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setError('New passwords do not match.');
            return;
        }

        setLoading(true);
        setMessage('');
        setError('');

        try {
            const publicRequest = createPublicRequest(user.token);

            const response = await publicRequest.put(
                '/users/change-password',
                { currentPassword, newPassword }
            );

            if (response.status === 200) {
                setMessage('Password changed successfully!');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');

                // Logout the user after 3 seconds
                setTimeout(() => {
                    dispatch(logout());
                }, 3000);
            } else {
                setError('Error: ' + response.data.error);
            }
        } catch (error) {
            setError(error.message);
            console.log(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        await handleChangePassword();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-light text-white mb-4 text-center">
                    Change Password
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <div className="text-red-500">{error}</div>}
                    {message && <div className="text-green-500">{message}</div>}

                    <div className="flex flex-col">
                        <label className="text-gray-300 mb-1" htmlFor="currentPassword">
                            Current Password
                        </label>
                        <input
                            type="password"
                            id="currentPassword"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="bg-gray-700 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-300 mb-1" htmlFor="newPassword">
                            New Password
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="bg-gray-700 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-gray-300 mb-1" htmlFor="confirmPassword">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="bg-gray-700 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all"
                        disabled={loading} // Disable the button while loading
                    >
                        {loading ? 'Changing...' : 'Change Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;