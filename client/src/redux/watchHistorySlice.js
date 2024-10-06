import { createSlice } from '@reduxjs/toolkit';

const watchHistory = localStorage.getItem("watchHistory")
    ? JSON.parse(localStorage.getItem("watchHistory"))
    : [];

const watchHistorySlice = createSlice({
    name: 'watchHistory',
    initialState: watchHistory,

    reducers: {
        addToWatchHistory: (state, action) => {
            const video = action.payload;

            // check to see if video is already in watch history
            const exists = state.find(item => item._id === video._id);
            if (!exists) {
                // add video if no duplicate
                state.push(video);

                // Set the video in the local storage for redux state management
                localStorage.setItem('watchHistory', JSON.stringify(state));
            }
        },

        clearWatchHistory: (state) => {
            // initialize the initial state to 0 (empty)
            state.length = 0;

            // clear the watch history from the local storage
            localStorage.removeItem('watchHistory');
        },

        removeVideoFromWatchHistory: (state, action) => {
            const video = action.payload;

            // remove the video
            const filteredVideos = state.filter(item => item._id !== video._id);

            // update the state
            localStorage.setItem('watchHistory', JSON.stringify(filteredVideos));

            return filteredVideos;
        },
    },
});

// exporting selector used to get watch history
export const selectWatchHistory = (state) => state.watchHistory;

export const { addToWatchHistory, clearWatchHistory, removeVideoFromWatchHistory } = watchHistorySlice.actions;

export default watchHistorySlice.reducer;