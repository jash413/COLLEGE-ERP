import axios from 'axios';
import network from '../config/network';

const axiosInstance = axios.create({
  baseURL: network.server, // Replace with your API base URL
  // Other default config options like headers, timeout, etc. can be set here
});

// Add a request interceptor to include headers or perform logic before sending a request
axiosInstance.interceptors.request.use(
  (config) => {
    // Example: Include authorization headers or other necessary logic
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
});

export { axiosInstance };
