/**
 * API SERVICE
 * Centralized API communication with backend
 */

import axios from 'axios';
import toast from 'react-hot-toast';

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - adds auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handles errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      if (status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        toast.error('Session expired. Please login again.');
      } else if (status === 403) {
        toast.error(data.message || 'Access denied');
      } else if (status === 404) {
        toast.error(data.message || 'Resource not found');
      } else if (status === 500) {
        toast.error('Server error. Please try again later.');
      } else {
        toast.error(data.message || 'An error occurred');
      }
    } else if (error.request) {
      toast.error('Network error. Check your connection.');
    } else {
      toast.error('Application error');
    }
    
    return Promise.reject(error);
  }
);

const apiService = {
  users: {
    register: (data) => apiClient.post('/users/register', data),
    login: (data) => apiClient.post('/users/login', data),
    getProfile: () => apiClient.get('/users/profile'),
    updateProfile: (data) => apiClient.put('/users/profile', data)
  },
  quizzes: {
    getAll: (params) => apiClient.get('/quizzes', { params }),
    getById: (id) => apiClient.get(`/quizzes/${id}`),
    create: (data) => apiClient.post('/quizzes', data),
    update: (id, data) => apiClient.put(`/quizzes/${id}`, data),
    delete: (id) => apiClient.delete(`/quizzes/${id}`)
  },
  results: {
    submit: (data) => apiClient.post('/results', data),
    getUserResults: () => apiClient.get('/results/my-results'),
    getById: (id) => apiClient.get(`/results/${id}`)
  }
};

export default apiService;