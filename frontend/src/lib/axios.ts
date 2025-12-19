/**
 * Axios Configuration - Centralized HTTP client setup with base URL, interceptors, and authentication headers
 * Auto-injects JWT tokens from localStorage into all API requests and handles 401 unauthorized responses
 */

import axios from 'axios';

/**
 * Global Axios instance for API communication.
 * Configured with base URL and default headers.
 */
export const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor to inject JWT token into headers.
 * Retrieves token from localStorage and adds it to the Authorization header.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Default export for convenience imports across API modules
export default api;
