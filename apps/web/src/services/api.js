import axios from 'axios';
import { io } from 'socket.io-client';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const SOCKET_BASE = API_BASE.replace('/api/v1', '');

export const apiClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let socket = null;

export const getSocket = () => {
  if (!socket) {
    const token = localStorage.getItem('lifeverse_access_token');
    socket = io(SOCKET_BASE, {
      auth: { token },
      withCredentials: true,
      autoConnect: true,
    });
  }
  return socket;
};

// Request Interceptor: Attach JWT
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('lifeverse_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Handle Refresh
apiClient.interceptors.response.use(
  (res) => res.data,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry && !original.url.includes('/auth/login')) {
      original._retry = true;
      try {
        const refreshRes = await axios.post(
          `${API_BASE}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );
        if (refreshRes.data?.data?.accessToken) {
          const newToken = refreshRes.data.data.accessToken;
          localStorage.setItem('lifeverse_access_token', newToken);
          original.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(original);
        }
      } catch (refreshErr) {
        localStorage.removeItem('lifeverse_access_token');
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default apiClient;
