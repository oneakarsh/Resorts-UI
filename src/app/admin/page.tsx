'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
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
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Hotel as HotelIcon,
  BookOnline as BookingIcon,
  People as PeopleIcon,
  AdminPanelSettings as AdminIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { resortAPI, bookingAPI, userAPI, superAdminAPI } from '@/lib/api';
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

  const router = useRouter();
  const { data: session, status } = useSession();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const isSuperAdmin = currentUser?.role === 'SuperAdmin';
      
      let statsData;
      let bookingsData;
      let resortsData;
      let usersData = [];

      if (isSuperAdmin) {
        const [statsRes, resortsRes, usersRes] = await Promise.all([
          superAdminAPI.getStats(session?.accessToken),
          superAdminAPI.getAllResorts ? superAdminAPI.getAllResorts(session?.accessToken) : resortAPI.getAll(session?.accessToken),
          superAdminAPI.getAllUsers(session?.accessToken)
        ]);
        
        statsData = statsRes.data?.data?.stats || statsRes.data?.stats;
        resortsData = resortsRes.data?.data || resortsRes.data;
        usersData = usersRes.data?.data || usersRes.data;
        
        // Super Admin gets all bookings from stats or another call
        const bookingsRes = await bookingAPI.getAllAdmin(session?.accessToken);
        bookingsData = bookingsRes.data?.data || bookingsRes.data;
      } else {
        const [statsRes, bookingsRes, resortsRes] = await Promise.all([
          bookingAPI.getDashboardStats(session?.accessToken),
          bookingAPI.getAllAdmin(session?.accessToken),
          resortAPI.getAll(session?.accessToken) // Or manager resorts API if implemented
        ]);
        
        statsData = statsRes.data?.data?.stats || statsRes.data?.stats;
        bookingsData = bookingsRes.data?.data || bookingsRes.data;
        resortsData = resortsRes.data?.data || resortsRes.data;
      }

      setResorts(Array.isArray(resortsData) ? resortsData : []);
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      setUsers(Array.isArray(usersData) ? usersData : []);

      setStats({
        totalResorts: statsData?.totalResorts || resortsData?.length || 0,
        totalBookings: statsData?.totalBookings || bookingsData?.length || 0,
        pendingBookings: statsData?.pendingResorts || statsData?.pendingBookings || 0,
        confirmedBookings: statsData?.totalRevenue ? 1 : (statsData?.confirmedBookings || 0), // Placeholder logic if stats differ
      });
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  }, [session?.accessToken, currentUser?.role]);

  useEffect(() => {
    if (status === 'loading') return;

    if (status !== 'authenticated' || !session) {
      router.push('/login');
      return;
    }

    // Check if user has admin or superadmin role
    const userRole = session.user.role as string;
    const normalizedRole = userRole.toLowerCase();
    
    if (normalizedRole !== 'admin' && normalizedRole !== 'superadmin') {
      router.push('/');
      return;
    }

    setCurrentUser(session.user as any as User);
    fetchData();
  }, [router, session, status, fetchData]);

  // Reset tab value if current tab is not available for the user's role
  useEffect(() => {
    const role = currentUser?.role?.toLowerCase();
    if (role === 'admin' && tabValue > 1) {
      setTabValue(1); 
    }
  }, [currentUser?.role, tabValue]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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
      <Box sx={{ py: 4, px: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
          Admin Dashboard
        </Typography>

      {/* Overview Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <HotelIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Resorts</Typography>
              </Box>
              <Typography variant="h4" color="primary">{stats.totalResorts}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <BookingIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Bookings</Typography>
              </Box>
              <Typography variant="h4" color="primary">{stats.totalBookings}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <BookingIcon sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="h6">Pending</Typography>
              </Box>
              <Typography variant="h4" sx={{ color: 'warning.main' }}>{stats.pendingBookings}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <BookingIcon sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6">Confirmed</Typography>
              </Box>
              <Typography variant="h4" sx={{ color: 'success.main' }}>{stats.confirmedBookings}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab icon={<DashboardIcon />} label="Overview" />
          <Tab icon={<BookingIcon />} label="Manage Bookings" />
        </Tabs>

        {/* Overview Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box>
            {/* Welcome Header */}
            <Box
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                p: 4,
                borderRadius: 3,
                color: 'white',
                mb: 4,
                textAlign: 'center'
              }}
            >
              <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
                Welcome back, {currentUser?.name || 'Admin'}!
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, mb: 1 }}>
                {(currentUser?.role as string)?.toLowerCase() === 'superadmin' ? 'Super Admin Dashboard' : 'Admin Dashboard'}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.8 }}>
                {(currentUser?.role as string)?.toLowerCase() === 'superadmin'
                  ? 'Manage users, resorts, and oversee the entire system'
                  : 'Manage bookings and oversee resort operations'
                }
              </Typography>
            </Box>

            {/* System Stats */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' }
                }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={1}>
                      <HotelIcon sx={{ mr: 1, fontSize: 28 }} />
                      <Typography variant="h6">Total Resorts</Typography>
                    </Box>
                    <Typography variant="h3" fontWeight="bold">{stats.totalResorts}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                  color: 'white',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' }
                }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={1}>
                      <BookingIcon sx={{ mr: 1, fontSize: 28 }} />
                      <Typography variant="h6">Total Bookings</Typography>
                    </Box>
                    <Typography variant="h3" fontWeight="bold">{stats.totalBookings}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: 'white',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' }
                }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={1}>
                      <BookingIcon sx={{ mr: 1, fontSize: 28 }} />
                      <Typography variant="h6">Pending</Typography>
                    </Box>
                    <Typography variant="h3" fontWeight="bold">{stats.pendingBookings}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  color: 'white',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' }
                }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={1}>
                      <BookingIcon sx={{ mr: 1, fontSize: 28 }} />
                      <Typography variant="h6">Confirmed</Typography>
                    </Box>
                    <Typography variant="h3" fontWeight="bold">{stats.confirmedBookings}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Super Admin Additional Stats */}
            {((currentUser?.role as string)?.toLowerCase() === 'superadmin') && (
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card sx={{
                    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                    color: 'white',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-4px)' }
                  }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={1}>
                        <AdminIcon sx={{ mr: 1, fontSize: 28 }} />
                        <Typography variant="h6">Total Admins</Typography>
                      </Box>
                      <Typography variant="h3" fontWeight="bold">
                        {users.filter(u => (u.role as string)?.toLowerCase() === 'admin').length}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card sx={{
                    background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
                    color: 'white',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-4px)' }
                  }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={1}>
                        <SecurityIcon sx={{ mr: 1, fontSize: 28 }} />
                        <Typography variant="h6">Super Admins</Typography>
                      </Box>
                      <Typography variant="h3" fontWeight="bold">
                        {users.filter(u => (u.role as string)?.toLowerCase() === 'superadmin').length}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}

            {/* Quick Actions */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Quick Actions</Typography>
              <Grid container spacing={2}>
                {((currentUser?.role as string)?.toLowerCase() === 'superadmin') && (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<HotelIcon />}
                      onClick={() => router.push('/admin/resorts')}
                      sx={{
                        py: 2,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                        }
                      }}
                    >
                      Manage Resorts
                    </Button>
                  </Grid>
                )}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<BookingIcon />}
                    onClick={() => setTabValue(1)}
                    sx={{
                      py: 2,
                      background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #6a4190 0%, #5a6fd8 100%)',
                      }
                    }}
                  >
                    Manage Bookings
                  </Button>
                </Grid>
                {((currentUser?.role as string)?.toLowerCase() === 'superadmin') && (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<PeopleIcon />}
                      onClick={() => router.push('/admin/users')}
                      sx={{
                        py: 2,
                        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #e55a50 0%, #d64a1f 100%)',
                        }
                      }}
                    >
                      Manage Users
                    </Button>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Box>
        </TabPanel>

        {/* Manage Bookings Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box>
            {/* Header */}
            <Box
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                p: 3,
                borderRadius: 2,
                color: 'white',
                mb: 4,
                textAlign: 'center'
              }}
            >
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
                <BookingIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Booking Management
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Review and manage customer reservations
              </Typography>
            </Box>

            {/* Bookings Table */}
            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
              <Table>
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Resort</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Check-in</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Check-out</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Guests</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Total Price</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow
                      key={booking._id || booking.id}
                      sx={{
                        '&:hover': { backgroundColor: '#f9f9f9' },
                        transition: 'background-color 0.2s'
                      }}
                    >
                      <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                        {(booking._id || booking.id).slice(-8)}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>
                        {booking.resortId?.name || 'Unknown'}
                      </TableCell>
                      <TableCell>{new Date(booking.checkIn).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(booking.checkOut).toLocaleDateString()}</TableCell>
                      <TableCell>{booking.guests}</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        ${booking.totalPrice}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={booking.status}
                          color={getStatusColor(booking.status.toLowerCase() as any)}
                          size="small"
                          variant="filled"
                          sx={{
                            fontWeight: 'bold',
                            textTransform: 'capitalize'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {(booking.status.toLowerCase() === 'pending') && (
                          <Box>
                            <Button
                              size="small"
                              color="success"
                              onClick={() => handleUpdateBookingStatus(booking._id || booking.id, 'Confirmed')}
                              sx={{
                                mr: 1,
                                backgroundColor: '#2e7d32',
                                color: 'white',
                                '&:hover': { backgroundColor: '#1b5e20' }
                              }}
                            >
                              Confirm
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              onClick={() => handleUpdateBookingStatus(booking._id || booking.id, 'Cancelled')}
                              sx={{
                                backgroundColor: '#d32f2f',
                                color: 'white',
                                '&:hover': { backgroundColor: '#b71c1c' }
                              }}
                            >
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
                <BookingIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                <Typography variant="h6" color="textSecondary">
                  No bookings found
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Bookings will appear here once customers make reservations
                </Typography>
              </Box>
            )}
          </Box>
        </TabPanel>
      </Paper>
    </Box>


    </div>
  );
}