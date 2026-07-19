import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: 'https://tokraf-backend.vercel.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor — inject token ──────────────────────────────────────
api.interceptors.request.use((config) => {
  // Ambil dari localStorage — kompatibel dengan admin & user
  const adminToken = localStorage.getItem('tokraf-admin-token');
  const userToken = localStorage.getItem('tokraf-user-token');
  const token = adminToken || userToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response Interceptor — handle 401 ────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Auto-logout jika token expired atau invalid
      useAuthStore.getState().logout();
      
      // Jika di admin panel, force redirect ke admin login
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
