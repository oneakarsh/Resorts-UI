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
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  refresh: (token?: string) => api.post('/auth/refresh', {}, token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
  forgotPassword: (data: { email: string }) => api.post('/auth/forgot-password', data),
  resetPassword: (token: string, data: { password: string }) => api.post(`/auth/reset-password/${token}`, data),
  profile: (token?: string) => api.get('/auth/profile', token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
  createResortOwner: (data: any, token?: string) => api.post('/auth/resort-owner/create', data, token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
  createResortManager: (data: any, token?: string) => api.post('/auth/resort-manager/create', data, token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
  getResortOwners: (token?: string) => api.get('/auth/resort-owner/users', token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
};

// Resort APIs
export const resortAPI = {
  getAll: (params?: Record<string, any>, token?: string) => api.get('/resorts', { ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}), params: params || {} }),
  getById: (id: string, token?: string) => api.get(`/resorts/${id}`, token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
  create: (data: any, token?: string) => api.post('/resorts', data, token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
  update: (id: string, data: any, token?: string) => api.put(`/resorts/${id}`, data, token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
  delete: (id: string, token?: string) => api.delete(`/resorts/${id}`, token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
};

// Booking APIs
export const bookingAPI = {
  create: (data: any, token?: string) => api.post('/bookings', data, token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
  getAll: (token?: string) => api.get('/bookings', token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
  getById: (id: string, token?: string) => api.get(`/bookings/${id}`, token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
  cancel: (id: string, token?: string) => api.patch(`/bookings/${id}/cancel`, {}, token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
  getAllOwner: (token?: string) => api.get('/bookings/resort-owner/all', token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
  updateStatus: (id: string, status: string, token?: string) => api.patch(`/bookings/${id}/status`, { status }, token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
  getAllAdmin: (token?: string) => api.get('/admin/bookings', token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
};

// Management APIs
export const managementAPI = {
  getResorts: (token?: string) => api.get('/management/resorts', token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
  getInventory: (resortId: string, token?: string) => api.get(`/management/resorts/${resortId}/inventory`, token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
  getBookings: (token?: string) => api.get('/management/bookings', token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
};

// Chat APIs
export const chatAPI = {
  getInbox: (token?: string) => api.get('/chat/inbox', token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
  getConversations: (userId: string, token?: string) => api.get(`/chat/conversations/${userId}`, token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
  sendMessage: (data: { to: string; content: string; bookingId?: string }, token?: string) => api.post('/chat/send', data, token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
};

// Dashboard APIs
export const dashboardAPI = {
  getSuperAdminStats: (token?: string) => api.get('/dashboard/super-admin', token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
  getPropertyOwnerStats: (token?: string) => api.get('/dashboard/property-owner', token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
};

// User APIs (Super Admin / Resort Owner)
export const userAPI = {
  getAll: (token?: string) => api.get('/users', token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
  create: (data: any, token?: string) => api.post('/users', data, token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
  getById: (id: string, token?: string) => api.get(`/users/${id}`, token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
  update: (id: string, data: any, token?: string) => api.put(`/users/${id}`, data, token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
  delete: (id: string, token?: string) => api.delete(`/users/${id}`, token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
  getPropertyOwners: (token?: string) => api.get('/auth/resort-owner/users', token ? { headers: { Authorization: `Bearer ${token}` } } : {}), // Kept for backward compat if needed
};
