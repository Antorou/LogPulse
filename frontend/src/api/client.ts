import axios from 'axios';

// Create a custom Axios instance
const apiClient = axios.create({
  baseURL: '/api', // Use relative path so Ingress routes it
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response Interceptor: Handle 401 Unauthorized globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Force redirect to login page
      if (window.location.pathname !== '/login') {
         window.location.href = '/login'; 
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
