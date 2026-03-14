import axios from 'axios';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  return config;
});

// Auth APIs
export const authAPI = {
  register: (data: any) =>
    api.post('/auth/register', data),
  login: (data: any) =>
    api.post('/auth/login', data),
  getMe: (token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    return api.get('/auth/me', config);
  },
};

// Resort APIs
export const resortAPI = {
  getAll: (token?: string, params?: any) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` }, params } : { params };
    return api.get('/resorts', config);
  },
  getById: (id: string, token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    return api.get(`/resorts/${id}`, config);
  },
  create: (data: any, token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    return api.post('/resorts', data, config);
  },
  update: (id: string, data: any, token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    return api.put(`/resorts/${id}`, data, config);
  },
  delete: (id: string, token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    return api.delete(`/resorts/${id}`, config);
  },
};

// Booking APIs
export const bookingAPI = {
  create: (data: any, token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    return api.post('/bookings', data, config);
  },
  getAll: (token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    return api.get('/bookings', config);
  },
  getById: (id: string, token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    return api.get(`/bookings/${id}`, config);
  },
  // Manager/Admin APIs
  updateStatus: (id: string, status: string, token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    return api.put(`/admin/bookings/${id}/status`, { status }, config);
  },
  getAllAdmin: (token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    return api.get('/admin/bookings', config);
  },
  getDashboardStats: (token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    return api.get('/admin/stats', config);
  },
};

// Super Admin APIs
export const superAdminAPI = {
  getStats: (token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    return api.get('/superadmin/stats', config);
  },
  getAllUsers: (token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    return api.get('/superadmin/users', config);
  },
  verifyResort: (id: string, verified: boolean, token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    return api.put(`/superadmin/resorts/${id}/verify`, { verified }, config);
  },
  getAllResorts: (token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    return api.get('/superadmin/resorts', config);
  },
};

// Individual User Management (from users.routes.js)
export const userAPI = {
  getAll: (token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    return api.get('/users/users', config);
  },
};
