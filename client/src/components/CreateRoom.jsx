import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RoomCreation = () => {
    const [roomId, setRoomId] = useState('');
    const navigate = useNavigate();

    const handleCreateRoom = () => {
        // Navigate to the live stream page with the new room ID
        navigate(`/live/${roomId}`);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
            <h1 className="text-4xl font-bold mb-6 text-gray-100">Create a Live Room</h1>
            <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter room ID"
                className="p-3 rounded-lg border-2 border-red-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-red-400 transition"
            />
            <button
                onClick={handleCreateRoom}
                className="mt-4 p-3 bg-red-600 text-white rounded-lg hover:bg-red-500 transition"
            >
                Create Room
            </button>
        </div>
    );
};

export default RoomCreation;