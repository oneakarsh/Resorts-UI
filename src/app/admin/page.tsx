'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Hotel as HotelIcon,
  BookOnline as BookingIcon,
  People as PeopleIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon,
  AdminPanelSettings as AdminIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { resortAPI, bookingAPI, userAPI } from '@/lib/api';
import { formatRupee } from '@/lib/formatRupee';
import { Resort, Booking, User } from '@/types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AdminDashboard() {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [stats, setStats] = useState({
    totalResorts: 0,
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
  });

  // Resort management state
  const [resortDialog, setResortDialog] = useState(false);
  const [editingResort, setEditingResort] = useState<Resort | null>(null);
  const [resortForm, setResortForm] = useState({
    name: '',
    description: '',
    location: '',
    latitude: 0,
    longitude: 0,
    pricePerNight: 0,
    amenities: '',
    maxGuests: 1,
    rooms: 1,
  });

  // User management state
  const [userDialog, setUserDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'admin' as 'admin' | 'superadmin',
    password: '',
  });

  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;

    if (status !== 'authenticated' || !session) {
      router.push('/login');
      return;
    }

    // Check if user has admin or superadmin role
    const userRole = (session.user as any)?.role;
    if (userRole !== 'admin' && userRole !== 'superadmin') {
      router.push('/');
      return;
    }

    // setCurrentUser(session.user as User);
    setCurrentUser(session.user as User);
    fetchData();
  }, [router, session, status]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const promises = [
        resortAPI.getAll(session?.accessToken),
        bookingAPI.getAllAdmin(session?.accessToken),
      ];

      // Fetch users only for superadmins
      if (currentUser?.role === 'superadmin') {
        promises.push(userAPI.getAll(session?.accessToken));
      }

      const [resortsRes, bookingsRes, usersRes] = await Promise.all(promises);

      const resortsData = resortsRes?.data?.data ?? resortsRes?.data ?? [];
      const bookingsData = bookingsRes?.data?.data ?? bookingsRes?.data ?? [];
      const usersData = usersRes?.data?.data ?? usersRes?.data ?? [];

      setResorts(Array.isArray(resortsData) ? resortsData : []);
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      if (currentUser?.role === 'superadmin') {
        setUsers(Array.isArray(usersData) ? usersData : []);
      }

      // Calculate stats
      setStats({
        totalResorts: resortsData.length || 0,
        totalBookings: bookingsData.length || 0,
        pendingBookings: bookingsData.filter((b: Booking) => b.status === 'pending').length || 0,
        confirmedBookings: bookingsData.filter((b: Booking) => b.status === 'confirmed').length || 0,
      });
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Resort management functions
  const handleOpenResortDialog = (resort?: Resort) => {
    if (resort) {
      setEditingResort(resort);
      setResortForm({
        name: resort.name,
        description: resort.description,
        location: resort.location,
        latitude: resort.latitude,
        longitude: resort.longitude,
        pricePerNight: resort.pricePerNight,
        amenities: resort.amenities.join(', '),
        maxGuests: resort.maxGuests,
        rooms: resort.rooms,
      });
    } else {
      setEditingResort(null);
      setResortForm({
        name: '',
        description: '',
        location: '',
        latitude: 0,
        longitude: 0,
        pricePerNight: 0,
        amenities: '',
        maxGuests: 1,
        rooms: 1,
      });
    }
    setResortDialog(true);
  };

  const handleCloseResortDialog = () => {
    setResortDialog(false);
    setEditingResort(null);
  };

  const handleSaveResort = async () => {
    try {
      const resortData = {
        ...resortForm,
        amenities: resortForm.amenities.split(',').map(a => a.trim()),
      };

      if (editingResort) {
        await resortAPI.update(editingResort.id!, resortData, session?.accessToken);
      } else {
        await resortAPI.create(resortData, session?.accessToken);
      }

      handleCloseResortDialog();
      fetchData();
    } catch (error) {
      console.error('Failed to save resort:', error);
    }
  };

  const handleDeleteResort = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this resort?')) {
      try {
        await resortAPI.delete(id, session?.accessToken);
        fetchData();
      } catch (error) {
        console.error('Failed to delete resort:', error);
      }
    }
  };

  // Booking management functions
  const handleUpdateBookingStatus = async (id: string, status: string) => {
    try {
      await bookingAPI.updateStatus(id, status, session?.accessToken);
      fetchData();
    } catch (error) {
      console.error('Failed to update booking status:', error);
    }
  };

  // User management functions
  const handleOpenUserDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setUserForm({
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role as 'admin' | 'superadmin',
        password: '', // Don't populate password for editing
      });
    } else {
      setEditingUser(null);
      setUserForm({
        name: '',
        email: '',
        phone: '',
        role: 'admin',
        password: '',
      });
    }
    setUserDialog(true);
  };

  const handleCloseUserDialog = () => {
    setUserDialog(false);
    setEditingUser(null);
  };

  const handleSaveUser = async () => {
    try {
      const userData = {
        ...userForm,
        ...(editingUser ? {} : { password: userForm.password }), // Only include password for new users
      };

      if (editingUser) {
        await userAPI.update(editingUser.id, userData, session?.accessToken);
      } else {
        await userAPI.create(userData, session?.accessToken);
      }

      handleCloseUserDialog();
      fetchData();
    } catch (error) {
      console.error('Failed to save user:', error);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userAPI.delete(id, session?.accessToken);
        fetchData();
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning' as const;
      case 'confirmed': return 'success' as const;
      case 'cancelled': return 'error' as const;
      default: return 'default' as const;
    }
  };

  // if (loading) {
  //   return (
  //     <Box sx={{ py: 4, px: 2 }}>
  //       <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
  //         <CircularProgress />
  //       </Box>
  //     </Box>
  //   );
  // }

  return (
    <div>
      <Box sx={{ py: 4, px: 2, maxWidth: 1200, mx: 'auto' }}>
        <Typography variant="h5" component="h1" sx={{ mb: 3, fontWeight: 600, color: '#0a0a0a' }}>
          Admin
        </Typography>

      {/* Overview Stats */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card variant="outlined" sx={{ borderColor: '#e5e5e5', boxShadow: 'none' }}>
            <CardContent sx={{ py: 2 }}>
              <Box display="flex" alignItems="center" mb={0.5}>
                <HotelIcon sx={{ mr: 1, color: '#737373', fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: '#737373', fontWeight: 500 }}>Total Resorts</Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#0a0a0a' }}>{stats.totalResorts}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card variant="outlined" sx={{ borderColor: '#e5e5e5', boxShadow: 'none' }}>
            <CardContent sx={{ py: 2 }}>
              <Box display="flex" alignItems="center" mb={0.5}>
                <BookingIcon sx={{ mr: 1, color: '#737373', fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: '#737373', fontWeight: 500 }}>Total Bookings</Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#0a0a0a' }}>{stats.totalBookings}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card variant="outlined" sx={{ borderColor: '#e5e5e5', boxShadow: 'none' }}>
            <CardContent sx={{ py: 2 }}>
              <Box display="flex" alignItems="center" mb={0.5}>
                <BookingIcon sx={{ mr: 1, color: '#737373', fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: '#737373', fontWeight: 500 }}>Pending</Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#0a0a0a' }}>{stats.pendingBookings}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card variant="outlined" sx={{ borderColor: '#e5e5e5', boxShadow: 'none' }}>
            <CardContent sx={{ py: 2 }}>
              <Box display="flex" alignItems="center" mb={0.5}>
                <BookingIcon sx={{ mr: 1, color: '#737373', fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: '#737373', fontWeight: 500 }}>Confirmed</Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#0a0a0a' }}>{stats.confirmedBookings}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper variant="outlined" sx={{ width: '100%', borderColor: '#e5e5e5', boxShadow: 'none' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            borderBottom: '1px solid #e5e5e5',
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 500 },
            '& .Mui-selected': { color: '#0a0a0a' },
            '& .MuiTabs-indicator': { backgroundColor: '#0a0a0a' },
          }}
        >
          <Tab icon={<DashboardIcon />} label="Overview" />
          <Tab icon={<HotelIcon />} label="Manage Resorts" />
          <Tab icon={<BookingIcon />} label="Manage Bookings" />
          {currentUser?.role === 'superadmin' && (
            <Tab icon={<PeopleIcon />} label="Manage Users" />
          )}
        </Tabs>

        {/* Overview Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#0a0a0a', mb: 0.5 }}>
                Welcome, {currentUser?.name || 'Admin'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#737373' }}>
                {currentUser?.role === 'superadmin'
                  ? 'Manage users, resorts, and the system'
                  : 'Manage resorts and bookings'}
              </Typography>
            </Box>

            {currentUser?.role === 'superadmin' && (
              <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card variant="outlined" sx={{ borderColor: '#e5e5e5', boxShadow: 'none' }}>
                    <CardContent sx={{ py: 2 }}>
                      <Box display="flex" alignItems="center" mb={0.5}>
                        <AdminIcon sx={{ mr: 1, color: '#737373', fontSize: 20 }} />
                        <Typography variant="body2" sx={{ color: '#737373', fontWeight: 500 }}>Admins</Typography>
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 600, color: '#0a0a0a' }}>
                        {users.filter(u => u.role === 'admin').length}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card variant="outlined" sx={{ borderColor: '#e5e5e5', boxShadow: 'none' }}>
                    <CardContent sx={{ py: 2 }}>
                      <Box display="flex" alignItems="center" mb={0.5}>
                        <SecurityIcon sx={{ mr: 1, color: '#737373', fontSize: 20 }} />
                        <Typography variant="body2" sx={{ color: '#737373', fontWeight: 500 }}>Super Admins</Typography>
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 600, color: '#0a0a0a' }}>
                        {users.filter(u => u.role === 'superadmin').length}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}

            <Alert severity="info" sx={{ borderRadius: 1.5, border: '1px solid #e5e5e5', bgcolor: '#fafafa' }} icon={false}>
              <Typography variant="body2" sx={{ color: '#737373' }}>
                Use the tabs above to manage resorts and bookings.
                {currentUser?.role === 'superadmin' && ' You can also manage user accounts.'}
              </Typography>
            </Alert>
          </Box>
        </TabPanel>

        {/* Manage Resorts Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#0a0a0a', mb: 0.5 }}>
                  Resorts
                </Typography>
                <Typography variant="body2" sx={{ color: '#737373' }}>
                  Create and manage properties
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => handleOpenResortDialog()}
                sx={{
                  bgcolor: '#0a0a0a',
                  fontWeight: 500,
                  '&:hover': { bgcolor: '#262626' },
                }}
              >
                Add resort
              </Button>
            </Box>

            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, borderColor: '#e5e5e5', boxShadow: 'none' }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#fafafa' }}>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.8125rem', color: '#0a0a0a', borderColor: '#e5e5e5' }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.8125rem', color: '#0a0a0a', borderColor: '#e5e5e5' }}>Location</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.8125rem', color: '#0a0a0a', borderColor: '#e5e5e5' }}>Price/Night</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.8125rem', color: '#0a0a0a', borderColor: '#e5e5e5' }}>Rooms</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.8125rem', color: '#0a0a0a', borderColor: '#e5e5e5' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {resorts.map((resort, index) => (
                    <TableRow
                      key={resort.id ?? resort._id ?? index}
                      sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}
                    >
                      <TableCell sx={{ borderColor: '#e5e5e5', fontSize: '0.875rem' }}>{resort.name}</TableCell>
                      <TableCell sx={{ borderColor: '#e5e5e5', fontSize: '0.875rem' }}>{resort.location}</TableCell>
                      <TableCell sx={{ borderColor: '#e5e5e5', fontWeight: 500, fontSize: '0.875rem' }}>{formatRupee(resort.pricePerNight)}</TableCell>
                      <TableCell sx={{ borderColor: '#e5e5e5', fontSize: '0.875rem' }}>{resort.rooms}</TableCell>
                      <TableCell sx={{ borderColor: '#e5e5e5' }}>
                        <Button
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => handleOpenResortDialog(resort)}
                          sx={{ mr: 0.5, color: '#0a0a0a', fontWeight: 500, '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeleteResort(resort.id ?? resort._id!)}
                          sx={{ color: '#dc2626', fontWeight: 500, '&:hover': { bgcolor: 'rgba(220,38,38,0.08)' } }}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {resorts.length === 0 && (
              <Box textAlign="center" py={6}>
                <HotelIcon sx={{ fontSize: 48, color: '#a3a3a3', mb: 1.5 }} />
                <Typography variant="body1" sx={{ color: '#737373', fontWeight: 500 }}>No resorts</Typography>
                <Typography variant="body2" sx={{ color: '#a3a3a3' }}>Add your first resort above</Typography>
              </Box>
            )}
          </Box>
        </TabPanel>

        {/* Manage Bookings Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#0a0a0a', mb: 0.5 }}>Bookings</Typography>
              <Typography variant="body2" sx={{ color: '#737373' }}>Review and manage reservations</Typography>
            </Box>

            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, borderColor: '#e5e5e5', boxShadow: 'none' }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#fafafa' }}>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.8125rem', color: '#0a0a0a', borderColor: '#e5e5e5' }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.8125rem', color: '#0a0a0a', borderColor: '#e5e5e5' }}>Resort</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.8125rem', color: '#0a0a0a', borderColor: '#e5e5e5' }}>Check-in</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.8125rem', color: '#0a0a0a', borderColor: '#e5e5e5' }}>Check-out</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.8125rem', color: '#0a0a0a', borderColor: '#e5e5e5' }}>Guests</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.8125rem', color: '#0a0a0a', borderColor: '#e5e5e5' }}>Total</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.8125rem', color: '#0a0a0a', borderColor: '#e5e5e5' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: '0.8125rem', color: '#0a0a0a', borderColor: '#e5e5e5' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id} sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}>
                      <TableCell sx={{ borderColor: '#e5e5e5', fontFamily: 'monospace', fontSize: '0.8125rem' }}>{booking.id.slice(-8)}</TableCell>
                      <TableCell sx={{ borderColor: '#e5e5e5', fontSize: '0.875rem' }}>{booking.resort?.name || '—'}</TableCell>
                      <TableCell sx={{ borderColor: '#e5e5e5', fontSize: '0.875rem' }}>{new Date(booking.checkInDate).toLocaleDateString()}</TableCell>
                      <TableCell sx={{ borderColor: '#e5e5e5', fontSize: '0.875rem' }}>{new Date(booking.checkOutDate).toLocaleDateString()}</TableCell>
                      <TableCell sx={{ borderColor: '#e5e5e5', fontSize: '0.875rem' }}>{booking.numberOfGuests}</TableCell>
                      <TableCell sx={{ borderColor: '#e5e5e5', fontWeight: 500, fontSize: '0.875rem' }}>{formatRupee(booking.totalPrice)}</TableCell>
                      <TableCell sx={{ borderColor: '#e5e5e5' }}>
                        <Chip
                          label={booking.status}
                          color={getStatusColor(booking.status)}
                          size="small"
                          variant="outlined"
                          sx={{ fontWeight: 500, textTransform: 'capitalize', fontSize: '0.75rem' }}
                        />
                      </TableCell>
                      <TableCell sx={{ borderColor: '#e5e5e5' }}>
                        {booking.status === 'pending' && (
                          <Box>
                            <Button size="small" onClick={() => handleUpdateBookingStatus(booking.id, 'confirmed')} sx={{ mr: 0.5, color: '#16a34a', fontWeight: 500 }}>
                              Confirm
                            </Button>
                            <Button size="small" onClick={() => handleUpdateBookingStatus(booking.id, 'cancelled')} sx={{ color: '#dc2626', fontWeight: 500 }}>
                              Cancel
                            </Button>
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {bookings.length === 0 && (
              <Box textAlign="center" py={6}>
                <BookingIcon sx={{ fontSize: 48, color: '#a3a3a3', mb: 1.5 }} />
                <Typography variant="body1" sx={{ color: '#737373', fontWeight: 500 }}>No bookings</Typography>
                <Typography variant="body2" sx={{ color: '#a3a3a3' }}>Reservations will appear here</Typography>
              </Box>
            )}
          </Box>
        </TabPanel>

        {/* Manage Users Tab (Super Admin Only) */}
        {currentUser?.role === 'superadmin' && (
          <TabPanel value={tabValue} index={3}>
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#0a0a0a', mb: 0.5 }}>Users</Typography>
                  <Typography variant="body2" sx={{ color: '#737373' }}>Manage admin accounts</Typography>
                </Box>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<PersonAddIcon />}
                  onClick={() => handleOpenUserDialog()}
                  sx={{ bgcolor: '#0a0a0a', fontWeight: 500, '&:hover': { bgcolor: '#262626' } }}
                >
                  Add admin
                </Button>
              </Box>

              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, borderColor: '#e5e5e5', boxShadow: 'none' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#fafafa' }}>
                      <TableCell sx={{ fontWeight: 600, fontSize: '0.8125rem', color: '#0a0a0a', borderColor: '#e5e5e5' }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '0.8125rem', color: '#0a0a0a', borderColor: '#e5e5e5' }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '0.8125rem', color: '#0a0a0a', borderColor: '#e5e5e5' }}>Phone</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '0.8125rem', color: '#0a0a0a', borderColor: '#e5e5e5' }}>Role</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '0.8125rem', color: '#0a0a0a', borderColor: '#e5e5e5' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}>
                        <TableCell sx={{ borderColor: '#e5e5e5', fontSize: '0.875rem' }}>{user.name}</TableCell>
                        <TableCell sx={{ borderColor: '#e5e5e5', fontSize: '0.875rem' }}>{user.email}</TableCell>
                        <TableCell sx={{ borderColor: '#e5e5e5', fontSize: '0.875rem' }}>{user.phone || '—'}</TableCell>
                        <TableCell sx={{ borderColor: '#e5e5e5' }}>
                          <Chip
                            label={user.role}
                            size="small"
                            variant="outlined"
                            sx={{
                              fontWeight: 500,
                              textTransform: 'capitalize',
                              fontSize: '0.75rem',
                              borderColor: '#e5e5e5',
                              color: '#0a0a0a',
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ borderColor: '#e5e5e5' }}>
                          <Button
                            size="small"
                            startIcon={<EditIcon />}
                            onClick={() => handleOpenUserDialog(user)}
                            sx={{ mr: 0.5, color: '#0a0a0a', fontWeight: 500, '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}
                          >
                            Edit
                          </Button>
                          {user.role !== 'superadmin' && (
                            <Button
                              size="small"
                              startIcon={<DeleteIcon />}
                              onClick={() => handleDeleteUser(user.id)}
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
                  <PeopleIcon sx={{ fontSize: 48, color: '#a3a3a3', mb: 1.5 }} />
                  <Typography variant="body1" sx={{ color: '#737373', fontWeight: 500 }}>No users</Typography>
                  <Typography variant="body2" sx={{ color: '#a3a3a3' }}>Add an admin above</Typography>
                </Box>
              )}
            </Box>
          </TabPanel>
        )}
      </Paper>
    </Box>

      {/* Resort Dialog */}
      <Dialog
        open={resortDialog}
        onClose={handleCloseResortDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2, border: '1px solid #e5e5e5' } }}
      >
        <DialogTitle sx={{ fontWeight: 600, fontSize: '1.125rem', color: '#0a0a0a' }}>
          {editingResort ? 'Edit resort' : 'Add resort'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Name"
                value={resortForm.name}
                onChange={(e) => setResortForm({ ...resortForm, name: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Location"
                value={resortForm.location}
                onChange={(e) => setResortForm({ ...resortForm, location: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={resortForm.description}
                onChange={(e) => setResortForm({ ...resortForm, description: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Price per Night"
                value={resortForm.pricePerNight}
                onChange={(e) => setResortForm({ ...resortForm, pricePerNight: Number(e.target.value) })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Max Guests"
                value={resortForm.maxGuests}
                onChange={(e) => setResortForm({ ...resortForm, maxGuests: Number(e.target.value) })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Rooms"
                value={resortForm.rooms}
                onChange={(e) => setResortForm({ ...resortForm, rooms: Number(e.target.value) })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Amenities (comma-separated)"
                value={resortForm.amenities}
                onChange={(e) => setResortForm({ ...resortForm, amenities: e.target.value })}
                helperText="e.g., WiFi, Pool, Spa, Restaurant"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Latitude"
                value={resortForm.latitude}
                onChange={(e) => setResortForm({ ...resortForm, latitude: Number(e.target.value) })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Longitude"
                value={resortForm.longitude}
                onChange={(e) => setResortForm({ ...resortForm, longitude: Number(e.target.value) })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseResortDialog} sx={{ color: '#737373', fontWeight: 500 }}>Cancel</Button>
          <Button onClick={handleSaveResort} variant="contained" sx={{ bgcolor: '#0a0a0a', fontWeight: 500, '&:hover': { bgcolor: '#262626' } }}>
            {editingResort ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* User Dialog (Super Admin Only) */}
      <Dialog
        open={userDialog}
        onClose={handleCloseUserDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2, border: '1px solid #e5e5e5' } }}
      >
        <DialogTitle sx={{ fontWeight: 600, fontSize: '1.125rem', color: '#0a0a0a', pt: 3, pb: 0 }}>
          {editingUser ? 'Edit user' : 'Add admin'}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Full Name"
                value={userForm.name}
                onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Phone Number"
                value={userForm.phone}
                onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                select
                label="User Role"
                value={userForm.role}
                onChange={(e) => setUserForm({ ...userForm, role: e.target.value as 'admin' | 'superadmin' })}
                SelectProps={{
                  native: true,
                }}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
                helperText={userForm.role === 'superadmin' ? 'Super admins can manage other users' : 'Admins can manage resorts and bookings'}
              >
                <option value="admin">Admin</option>
                <option value="superadmin">Super Admin</option>
              </TextField>
            </Grid>
            {!editingUser && (
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                  helperText="Minimum 8 characters required"
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={handleCloseUserDialog} sx={{ color: '#737373', fontWeight: 500 }}>Cancel</Button>
          <Button
            onClick={handleSaveUser}
            variant="contained"
            sx={{ bgcolor: '#0a0a0a', fontWeight: 500, '&:hover': { bgcolor: '#262626' } }}
          >
            {editingUser ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}