import axios from 'axios';
// import { APP_ENV } from '../config';

// const baseURL = APP_ENV.API_URL;
const baseURL = 'http://localhost:3000';

// use client for protected routes
// use api for all other routes
const client = axios.create({ baseURL });
const api = axios.create({ baseURL });

// Request interceptor to attach access token
client.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Response interceptor to handle 401
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only retry once
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${baseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const { accessToken: newAccessToken } = response.data;
        localStorage.setItem('accessToken', newAccessToken);

        // Retry original request with new token
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return client(originalRequest);
      } catch (err) {
        // Refresh failed: remove token
        localStorage.removeItem('accessToken');
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export { api, client };
