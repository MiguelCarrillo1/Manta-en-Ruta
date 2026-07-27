import axios from 'axios';
import { useAuthStore } from '../store';

const API_URL = 'http://192.168.0.106:8080/api/v1';

const api = axios.create({
  baseURL: API_URL,
  timeout: 8000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
