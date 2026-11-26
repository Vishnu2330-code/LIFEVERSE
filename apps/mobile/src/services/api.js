import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// For Android emulator, use 10.0.2.2; for physical devices, LAN IP; default localhost
const getBaseURL = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api/v1';
  }
  return 'http://localhost:5000/api/v1';
};

export const mobileApiClient = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
    'x-platform': 'android',
  },
  timeout: 15000,
});

// Interceptor: Attach stored access token from SecureStore
mobileApiClient.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync('lifeverse_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    // SecureStore access fallback
  }
  return config;
});

// Interceptor: Handle Token Refresh via SecureStore
mobileApiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry && !original.url.includes('/auth/login')) {
      original._retry = true;
      try {
        const storedRefreshToken = await SecureStore.getItemAsync('lifeverse_refresh_token');
        if (storedRefreshToken) {
          const res = await axios.post(`${getBaseURL()}/auth/refresh-token`, {
            refreshToken: storedRefreshToken,
          });

          if (res.data?.data?.accessToken) {
            const newAccess = res.data.data.accessToken;
            const newRefresh = res.data.data.refreshToken;

            await SecureStore.setItemAsync('lifeverse_access_token', newAccess);
            if (newRefresh) {
              await SecureStore.setItemAsync('lifeverse_refresh_token', newRefresh);
            }

            original.headers.Authorization = `Bearer ${newAccess}`;
            return mobileApiClient(original);
          }
        }
      } catch (refreshErr) {
        await SecureStore.deleteItemAsync('lifeverse_access_token');
        await SecureStore.deleteItemAsync('lifeverse_refresh_token');
      }
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default mobileApiClient;
