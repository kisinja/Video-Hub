import { createSlice } from "@reduxjs/toolkit";

// check localStorage for user data
const currentUser = localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser"))
    : null;

const userSlice = createSlice({
    name: "user",
    // Initial state
    initialState: {
        currentUser: currentUser,
        onlineUsers: {},
        isFetching: false,
        error: false,
    },
    reducers: {
        loginStart: (state) => {
            state.isFetching = true;
        },
        loginSuccess: (state, action) => {
            state.isFetching = false;
            state.currentUser = action.payload;
        },
        loginFailure: (state) => {
            state.isFetching = false;
            state.error = true;
        },
        logout: (state) => {
            state.currentUser = null;
        },

        // update user profile
        updateProfileStart: (state) => {
            state.isFetching = true;
        },
        updateProfileSuccess: (state, action) => {
            state.isFetching = false;
            state.currentUser = { ...state.currentUser, ...action.payload };

            // update localStorage
            localStorage.setItem("currentUser", JSON.stringify(state.currentUser));
        },
        updateProfileFailure: (state) => {
            state.isFetching = false;
            state.error = true;
        },

        // update online users
        updateUserStatus: (state, action) => {
            state.onlineUsers = action.payload;
        }
    }
});

export const {
    loginStart,
    loginSuccess,
    loginFailure,
    logout, updateProfileStart,
    updateProfileSuccess,
    updateProfileFailure,
    updateUserStatus
} = userSlice.actions;

export default userSlice.reducer;