import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import mobileApiClient from '../services/api.js';

export const useMobileAuth = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  checkAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync('lifeverse_access_token');
      if (!token) {
        set({ user: null, isAuthenticated: false, isLoading: false });
        return false;
      }

      const res = await mobileApiClient.get('/auth/me');
      if (res.success && res.data?.user) {
        set({ user: res.data.user, isAuthenticated: true, isLoading: false });
        return true;
      }
    } catch (err) {
      set({ user: null, isAuthenticated: false, isLoading: false });
      return false;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await mobileApiClient.post('/auth/login', { email, password });
      if (res.success && res.data) {
        await SecureStore.setItemAsync('lifeverse_access_token', res.data.accessToken);
        if (res.data.refreshToken) {
          await SecureStore.setItemAsync('lifeverse_refresh_token', res.data.refreshToken);
        }
        set({ user: res.data.user, isAuthenticated: true, isLoading: false });
        return res.data;
      }
    } catch (err) {
      set({ isLoading: false, error: err.message || 'Login failed' });
      throw err;
    }
  },

  register: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await mobileApiClient.post('/auth/register', formData);
      if (res.success && res.data) {
        await SecureStore.setItemAsync('lifeverse_access_token', res.data.accessToken);
        if (res.data.refreshToken) {
          await SecureStore.setItemAsync('lifeverse_refresh_token', res.data.refreshToken);
        }
        set({ user: res.data.user, isAuthenticated: true, isLoading: false });
        return res.data;
      }
    } catch (err) {
      set({ isLoading: false, error: err.message || 'Registration failed' });
      throw err;
    }
  },

  logout: async () => {
    try {
      const refreshToken = await SecureStore.getItemAsync('lifeverse_refresh_token');
      await mobileApiClient.post('/auth/logout', { refreshToken });
    } catch (err) {
      // Continue cleanup
    } finally {
      await SecureStore.deleteItemAsync('lifeverse_access_token');
      await SecureStore.deleteItemAsync('lifeverse_refresh_token');
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));

export default useMobileAuth;
