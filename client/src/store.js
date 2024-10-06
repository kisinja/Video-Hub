import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./redux/userSlice";
import watchHistoryReducer from './redux/watchHistorySlice';

export default configureStore({
    reducer: {
        user: userReducer,
        watchHistory: watchHistoryReducer
    },
});