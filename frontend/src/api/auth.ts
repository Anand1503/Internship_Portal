import axiosClient from "./axiosClient";
import apiClient from "./client";

// Types
interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

// Register user
export const register = (payload: RegisterPayload) => {
  return apiClient.post('/auth/register', payload);
};

// Login user
export const login = async (email: string, password: string) => {
  const res = await axiosClient.post("/auth/login", new URLSearchParams({
    username: email,
    password,
  }));
  const { access_token } = res.data;
  localStorage.setItem("access_token", access_token);
  return res.data;
};

export const getMe = async () => {
  const res = await axiosClient.get("/auth/me");
  return res.data;
};

// Usage:
// - Import functions: import { register, login, getMe } from '@/api/auth';
// - Register: register({ name, email, password }).then(...);
// - Login: login({ username: email, password }).then(() => { /* token stored */ });
// - Get me: getMe().then(user => ...);
