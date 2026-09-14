import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '/api',
});



// Interceptor to attach Authorization Bearer header
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('hms_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;
