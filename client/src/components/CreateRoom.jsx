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
        <div className="flex flex-col min-h-screen bg-black text-white items-center">

            <div className='mt-8 px-6 py-4 rounded shadow shadow-white w-full md:w-[600px]'>
                <center className='mb-4'>
                    <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-100">Create a Live Room</h1>
                    <p className="text-lg text-gray-500 tracking-wider">
                        Enter your <span className="text-red-700 italic">room ID</span> <br />
                        This will allow other users to join your live stream
                    </p>
                </center>

                <div className='flex gap-3 flex-col items-center'>
                    <input
                        type="text"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        placeholder="Enter room ID"
                        className="p-3 bg-red-700/30 text-gray-600 placeholder-gray-400 focus:outline-none focus:border-2 focus:border-blue-400 focus:bg-white transition"
                    />

                    <div>
                        {roomId && (
                            <p className='text-white text-sm'>Note:
                                &nbsp;
                                <span className='underline italic text-sm text-yellow-400'>
                                    {roomId} will be your room ID
                                </span>
                            </p>
                        )}
                    </div>

                    <button
                        onClick={handleCreateRoom}
                        className="mt-4 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition"
                    >
                        Create Room
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoomCreation;