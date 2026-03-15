import axios from 'axios';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests - this will be handled differently for client vs server
// For client components, we'll need to pass the token manually or use a different approach
api.interceptors.request.use((config) => {
  // This interceptor is mainly for server-side usage
  // Client-side components should pass the token directly
  return config;
});

// Auth APIs
export const authAPI = {
  register: (data: { name: string; email: string; password: string; confirmPassword: string; phone: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  profile: (token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    return api.get('/auth/profile', config);
  },
};

// Resort APIs
export const resortAPI = {
  getAll: (params?: Record<string, any>, token?: string) => {
    const config = {
      ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
      params: params || {},
    };
    return api.get('/resorts', config);
  },
  getById: (id: string, token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    return api.get(`/resorts/${id}`, config);
  },
  create: (data: Record<string, unknown>, token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    return api.post('/resorts', data, config);
  },
  update: (id: string, data: Record<string, unknown>, token?: string) => {
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
  create: (data: Record<string, unknown>, token?: string) => {
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
  updateStatus: (id: string, status: string, token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    return api.patch(`/bookings/${id}/status`, { status }, config);
  },
  cancel: (id: string, token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    return api.patch(`/bookings/${id}/cancel`, {}, config);
  },
  getAllAdmin: (token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    return api.get('/admin/bookings', config);
  },
};

// User APIs (for super admin)
export const userAPI = {
  getAll: (token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    return api.get('/users', config);
  },
  getPropertyOwners: (token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    return api.get('/auth/property-owner/users', config);
  },
  create: (data: Record<string, unknown>, token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    return api.post('/users', data, config);
  },
  update: (id: string, data: Record<string, unknown>, token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    return api.put(`/users/${id}`, data, config);
  },
  delete: (id: string, token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    return api.delete(`/users/${id}`, config);
  },
};

// Dashboard APIs
export const dashboardAPI = {
  getSuperAdminStats: (token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    return api.get('/dashboard/super-admin', config);
  },
  getPropertyOwnerStats: (token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    return api.get('/dashboard/property-owner', config);
  },
};

// Chat APIs
export const chatAPI = {
  getInbox: (token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    return api.get('/chat/inbox', config);
  },
  sendMessage: (data: { receiverId: string; message: string; resortId?: string }, token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    return api.post('/chat/send', data, config);
  },
};
