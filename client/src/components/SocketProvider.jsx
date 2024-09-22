import { io } from "socket.io-client";
import { updateUserStatus } from '../redux/userSlice'; // Import the action
import { useDispatch } from 'react-redux';
import { useEffect } from "react";

export const useSocketConnection = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const socket = io('http://localhost:3501'); // Update with your backend URL

        // Handle user status update
        socket.on('user_status_update', (users) => {
            dispatch(updateUserStatus(users)); // Dispatching the updated online users to the Redux store
        });

        // Emit 'user_connected' event to notify the server
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            socket.emit('user_connected', currentUser._id);
        }

        // Clean up when component unmounts
        return () => {
            socket.disconnect();
        };
    }, [dispatch]);
};