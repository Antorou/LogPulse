import axios from 'axios';

// Create a custom Axios instance
const apiClient = axios.create({
  baseURL: 'http://localhost:8000', // Our FastAPI backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Automatically attach the JWT token if it exists
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401 Unauthorized globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token is invalid/expired, clear it
      localStorage.removeItem('token');
      // Force redirect to login page
      if (window.location.pathname !== '/login') {
         window.location.href = '/login'; 
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
