import apiClient, { setAuthToken } from './axiosClient';

// Types
interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface LoginPayload {
  username: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

// Register user
export const register = (payload: RegisterPayload) => {
  return apiClient.post('/auth/register', payload);
};

// Login user
export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await apiClient.post('/auth/token', new URLSearchParams(payload as unknown as Record<string, string>), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  const data = response.data;
  // Store token in localStorage
  localStorage.setItem('access_token', data.access_token);
  // Set auth token in axios client
  setAuthToken(data.access_token);
  return data;
};

// Get current user
export const getMe = (): Promise<User> => {
  return apiClient.get('/auth/me');
};

// Usage:
// - Import functions: import { register, login, getMe } from '@/api/auth';
// - Register: register({ name, email, password }).then(...);
// - Login: login({ username: email, password }).then(() => { /* token stored */ });
// - Get me: getMe().then(user => ...);
