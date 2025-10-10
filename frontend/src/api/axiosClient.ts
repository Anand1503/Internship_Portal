import axios from 'axios';

// Create axios instance with base URL from environment or default
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000',
});

// Function to set or remove Authorization header
export const setAuthToken = (token?: string) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

// Request interceptor to automatically attach token from localStorage
apiClient.interceptors.request.use(
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

export default apiClient;

/*
Usage in other modules:
- Import apiClient: import apiClient from '@/api/axiosClient';
- Use for API calls: apiClient.get('/endpoint');
- Set token on login: setAuthToken(token);
- Remove token on logout: setAuthToken();
*/
