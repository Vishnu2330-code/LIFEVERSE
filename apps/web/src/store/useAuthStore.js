import { create } from 'zustand';
import apiClient, { getSocket } from '../services/api.js';

export const useAuthStore = create((set, get) => ({
  user: null,
  gamification: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  setToken: (token) => {
    if (token) {
      localStorage.setItem('lifeverse_access_token', token);
    } else {
      localStorage.removeItem('lifeverse_access_token');
    }
  },

  checkAuth: async () => {
    try {
      const token = localStorage.getItem('lifeverse_access_token');
      if (!token) {
        set({ user: null, gamification: null, isAuthenticated: false, isLoading: false });
        return false;
      }

      const res = await apiClient.get('/auth/me');
      if (res.success && res.data?.user) {
        set({
          user: res.data.user,
          gamification: res.data.gamification,
          isAuthenticated: true,
          isLoading: false,
        });
        getSocket();
        return true;
      }
    } catch (err) {
      set({ user: null, gamification: null, isAuthenticated: false, isLoading: false });
      return false;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      if (res.success && res.data) {
        get().setToken(res.data.accessToken);
        set({
          user: res.data.user,
          isAuthenticated: true,
          isLoading: false,
        });
        getSocket();
        return res.data;
      }
    } catch (err) {
      set({ isLoading: false, error: err.message || 'Login failed' });
      throw err;
    }
  },

  adminLogin: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await apiClient.post('/auth/admin-login', { email, password });
      if (res.success && res.data) {
        get().setToken(res.data.accessToken);
        set({
          user: res.data.user,
          isAuthenticated: true,
          isLoading: false,
        });
        return res.data;
      }
    } catch (err) {
      set({ isLoading: false, error: err.message || 'Admin login failed' });
      throw err;
    }
  },

  register: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await apiClient.post('/auth/register', formData);
      if (res.success && res.data) {
        get().setToken(res.data.accessToken);
        set({
          user: res.data.user,
          isAuthenticated: true,
          isLoading: false,
        });
        getSocket();
        return res.data;
      }
    } catch (err) {
      set({ isLoading: false, error: err.message || 'Registration failed' });
      throw err;
    }
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (err) {
      // Continue cleanup
    } finally {
      get().setToken(null);
      set({ user: null, gamification: null, isAuthenticated: false, isLoading: false });
    }
  },

  updateUserProfile: (updatedUser) => {
    set((state) => ({ user: { ...state.user, ...updatedUser } }));
  },
}));

export default useAuthStore;
