import axios from 'axios';

import { SESSION_KEY } from '../context/auth';

// TODO: cookie-based auth

const api = axios.create({
  baseURL: '/api',
  timeout: 15000 // 15s covers polling responses and normal API calls
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem(SESSION_KEY);
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // skip redirect loop for login endpoint itself
      if (!error.config?.url?.includes('/auth/login')) {
        window.dispatchEvent(new Event('panorama:unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
