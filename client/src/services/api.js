import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// API Users
export const authAPI = {
  register: (data) => api.post('/users/register', data),
  login: (data) => api.post('/users/login', data),
  logout: () => api.post('/users/logout'),
  checkAuth: () => api.get('/check-auth')
};

// API Projets
export const projetAPI = {
  getAll: (page = 1, limit = 6) => api.get(`/projets?page=${page}&limit=${limit}`),
  getById: (id) => api.get(`/projets/${id}`),
  create: (data) => api.post('/projets', data),
  update: (id, data) => api.put(`/projets/${id}`, data),
  delete: (id) => api.delete(`/projets/${id}`),
  getCategories: () => api.get('/projets/categories'),
};

// API Reviews
export const reviewAPI = {
  getByProjet: (projetId) => api.get(`/reviews/projet/${projetId}`),
  add: (projetId, data) => api.post(`/reviews/projet/${projetId}`, data),
  update: (reviewId, data) => api.put(`/reviews/${reviewId}`, data),
  delete: (reviewId) => api.delete(`/reviews/${reviewId}`),
};

// Admin-only API
export const adminAPI = {
  getAllUsers: () => api.get('/users/all'),
  deleteUser: (userId) => api.delete(`/users/delete/${userId}`),
};

export default api;


