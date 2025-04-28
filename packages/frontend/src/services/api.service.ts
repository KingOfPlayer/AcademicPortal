import axios from 'axios';

// API temel URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Axios instance oluşturma
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Oturum süresi doldu, giriş sayfasına yönlendir
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/loginpage';
    }
    return Promise.reject(error);
  }
);

export default apiClient;