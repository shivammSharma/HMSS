import axios from 'axios';

// Render backend - confirmed working with MongoDB Atlas connected
const RENDER_URL = 'https://hmss-brxp.onrender.com/api';

const API = axios.create({
  baseURL: RENDER_URL,
  timeout: 30000,  // 30s to handle Render cold starts
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

// Wake up Render on first load (prevents cold-start delays)
export const wakeUpServer = () => {
  axios.get(`${RENDER_URL}/health`, { timeout: 30000 }).catch(() => {});
};

export default API;

