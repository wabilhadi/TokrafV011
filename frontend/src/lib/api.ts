import axios from 'axios';

const api = axios.create({
  baseURL: `http://${window.location.hostname}:5000/api`, // Dynamically uses computer's IP
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tokraf-admin-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
