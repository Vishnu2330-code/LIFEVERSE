import axios from 'axios';

let accessToken = null;
let onTokenExpiredCallback = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

export const setTokenExpiredHandler = (callback) => {
  onTokenExpiredCallback = callback;
};

export const createApiClient = (baseURL = 'http://localhost:5000/api/v1') => {
  const instance = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 15000,
  });

  instance.interceptors.request.use(
    (config) => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response.data,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const res = await axios.post(
            `${baseURL}/auth/refresh-token`,
            {},
            { withCredentials: true }
          );
          if (res.data?.data?.accessToken) {
            setAccessToken(res.data.data.accessToken);
            originalRequest.headers.Authorization = `Bearer ${res.data.data.accessToken}`;
            return instance(originalRequest);
          }
        } catch (refreshErr) {
          if (onTokenExpiredCallback) {
            onTokenExpiredCallback();
          }
          return Promise.reject(refreshErr);
        }
      }
      return Promise.reject(error.response?.data || error);
    }
  );

  return instance;
};

export default createApiClient;
