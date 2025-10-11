import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosClient.defaults.headers.common["Authorization"];
  }
};

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && error.config.url.includes('/auth/me')) {
      localStorage.removeItem("access_token");
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
/*
Usage in other modules:
- Import apiClient: import apiClient from '@/api/axiosClient';
- Use for API calls: apiClient.get('/endpoint');
- Set token on login: setAuthToken(token);
- Remove token on logout: setAuthToken();
*/
