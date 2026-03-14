'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Chip,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { userAPI } from '@/lib/api';
import { User } from '@/types';

export default function RolesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'admin' as 'admin' | 'superadmin',
    password: '',
  });

  useEffect(() => {
    if (status === 'loading') return;

    if (status !== 'authenticated' || !session) {
      router.push('/login');
      return;
    }

    // Check if user is super admin
    const userRole = (session.user as any)?.role;
    if (userRole !== 'superadmin') {
      router.push('/');
      return;
    }

    fetchUsers();
  }, [router, session, status]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAll(session?.accessToken);
      const usersData = response?.data?.data ?? response?.data ?? [];
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone ?? '',
        role: user.role as 'admin' | 'superadmin',
        password: '',
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'admin',
        password: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingUser(null);
  };

  const handleSave = async () => {
    try {
      const userData = {
        ...formData,
        ...(editingUser ? {} : { password: formData.password }),
      };

      if (editingUser) {
        await userAPI.update(editingUser.id!, userData, session?.accessToken);
      } else {
        await userAPI.create(userData, session?.accessToken);
      }

      handleCloseDialog();
      fetchUsers();
    } catch (error) {
      console.error('Failed to save user:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userAPI.delete(id, session?.accessToken);
        fetchUsers();
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ py: 4, px: 2 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress sx={{ color: '#0a0a0a' }} />
        </Box>
      </Box>
    );
  }

  const adminCount = users.filter(u => u.role === 'admin').length;
  const superAdminCount = users.filter(u => u.role === 'superadmin').length;

  return (
    <Box sx={{ py: 4, px: 2, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 600, color: '#0a0a0a', mb: 0.5 }}>
          User Roles & Permissions
        </Typography>
        <Typography variant="body2" sx={{ color: '#737373' }}>
          Manage admin and super admin roles
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card variant="outlined" sx={{ borderColor: '#e5e5e5', boxShadow: 'none' }}>
            <CardContent sx={{ py: 2 }}>
              <Box display="flex" alignItems="center" mb={0.5}>
                <AdminIcon sx={{ mr: 1, color: '#737373', fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: '#737373', fontWeight: 500 }}>
                  Admins
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#0a0a0a' }}>
                {adminCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card variant="outlined" sx={{ borderColor: '#e5e5e5', boxShadow: 'none' }}>
            <CardContent sx={{ py: 2 }}>
              <Box display="flex" alignItems="center" mb={0.5}>
                <SecurityIcon sx={{ mr: 1, color: '#737373', fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: '#737373', fontWeight: 500 }}>
                  Super Admins
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#0a0a0a' }}>
                {superAdminCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card variant="outlined" sx={{ borderColor: '#e5e5e5', boxShadow: 'none' }}>
            <CardContent sx={{ py: 2 }}>
              <Box display="flex" alignItems="center" mb={0.5}>
                <PersonIcon sx={{ mr: 1, color: '#737373', fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: '#737373', fontWeight: 500 }}>
                  Total Users
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#0a0a0a' }}>
                {users.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* User Management Section */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#0a0a0a', mb: 0.5 }}>
            Users
          </Typography>
          <Typography variant="body2" sx={{ color: '#737373' }}>
            View and manage all admin accounts
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            bgcolor: '#0a0a0a',
            fontWeight: 500,
            '&:hover': { bgcolor: '#262626' },
          }}
        >
          Add User
        </Button>
      </Box>

      {/* Users Table */}
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, borderColor: '#e5e5e5', boxShadow: 'none' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#fafafa' }}>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8125rem', color: '#0a0a0a', borderColor: '#e5e5e5' }}>
                Name
              </TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8125rem', color: '#0a0a0a', borderColor: '#e5e5e5' }}>
                Email
              </TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8125rem', color: '#0a0a0a', borderColor: '#e5e5e5' }}>
                Phone
              </TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8125rem', color: '#0a0a0a', borderColor: '#e5e5e5' }}>
                Role
              </TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8125rem', color: '#0a0a0a', borderColor: '#e5e5e5' }}>
                Created
              </TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.8125rem', color: '#0a0a0a', borderColor: '#e5e5e5' }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}>
                <TableCell sx={{ borderColor: '#e5e5e5', fontSize: '0.875rem', fontWeight: 500 }}>
                  {user.name}
                </TableCell>
                <TableCell sx={{ borderColor: '#e5e5e5', fontSize: '0.875rem' }}>
                  {user.email}
                </TableCell>
                <TableCell sx={{ borderColor: '#e5e5e5', fontSize: '0.875rem' }}>
                  {user.phone || '—'}
                </TableCell>
                <TableCell sx={{ borderColor: '#e5e5e5' }}>
                  <Chip
                    label={user.role}
                    size="small"
                    variant="outlined"
                    icon={user.role === 'superadmin' ? <SecurityIcon /> : <AdminIcon />}
                    sx={{
                      fontWeight: 500,
                      textTransform: 'capitalize',
                      fontSize: '0.75rem',
                      borderColor: user.role === 'superadmin' ? '#dc2626' : '#0a0a0a',
                      color: user.role === 'superadmin' ? '#dc2626' : '#0a0a0a',
                    }}
                  />
                </TableCell>
                <TableCell sx={{ borderColor: '#e5e5e5', fontSize: '0.875rem' }}>
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                </TableCell>
                <TableCell sx={{ borderColor: '#e5e5e5' }}>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleOpenDialog(user)}
                    sx={{ mr: 0.5, color: '#0a0a0a', fontWeight: 500, '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}
                  >
                    Edit
                  </Button>
                  {user.role !== 'superadmin' && (
                    <Button
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(user.id ?? user._id ?? '')}
                      sx={{ color: '#dc2626', fontWeight: 500, '&:hover': { bgcolor: 'rgba(220,38,38,0.08)' } }}
                    >
                      Delete
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {users.length === 0 && (
        <Box textAlign="center" py={6}>
          <PersonIcon sx={{ fontSize: 48, color: '#a3a3a3', mb: 1.5 }} />
          <Typography variant="body1" sx={{ color: '#737373', fontWeight: 500 }}>
            No users found
          </Typography>
          <Typography variant="body2" sx={{ color: '#a3a3a3' }}>
            Add your first admin user above
          </Typography>
        </Box>
      )}

      {/* Add/Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2, border: '1px solid #e5e5e5' } }}
      >
        <DialogTitle sx={{ fontWeight: 600, fontSize: '1.125rem', color: '#0a0a0a', pt: 3, pb: 0 }}>
          {editingUser ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              variant="outlined"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              variant="outlined"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              fullWidth
              label="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              variant="outlined"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              fullWidth
              select
              label="Role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'superadmin' })}
              SelectProps={{ native: true }}
              variant="outlined"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              helperText={
                formData.role === 'superadmin'
                  ? 'Super Admin can manage all users and system settings'
                  : 'Admin can manage resorts and bookings'
              }
            >
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </TextField>
            {!editingUser && (
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                variant="outlined"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                helperText="Minimum 8 characters required"
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={handleCloseDialog} sx={{ color: '#737373', fontWeight: 500 }}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{ bgcolor: '#0a0a0a', fontWeight: 500, '&:hover': { bgcolor: '#262626' } }}
          >
            {editingUser ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
