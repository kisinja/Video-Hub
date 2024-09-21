// axiosConfig.js

import axios from 'axios';

const BASE_URL = 'http://localhost:3500';

// Helper function to get the authorization header
const getAuthHeader = (token) => {
    return token ? `Bearer ${token}` : '';
};

// Function to create a configured axios instance
export const createPublicRequest = (token) => {
    return axios.create({
        baseURL: `${BASE_URL}/api`,
        headers: {
            'Authorization': getAuthHeader(token)
        }
    });
};

export const createUserRequest = () => {
    return axios.create({
        baseURL: `${BASE_URL}/api/auth`,
    });
};