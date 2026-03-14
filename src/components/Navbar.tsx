'use client';

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Dialog,
  Typography,
} from '@mui/material';
import {
  FilterList as FilterListIcon,
  Tune as TuneOffIcon,
  NotificationsNone as NotificationsIcon,
  ChatBubbleOutline as ChatIcon,
  FilterAlt as FilterAltIcon,
  FilterAltOff,
} from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import dynamic from 'next/dynamic';
import SearchBar from './SearchBar';
import AdvancedFilters from './AdvancedFilters';
import UserMenu from './UserMenu';

const LoginDialog = dynamic(() => import('./LoginDialog'), { ssr: false });
const RegisterDialog = dynamic(() => import('./RegisterDialog'), { ssr: false });

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { data: session, status } = useSession();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    amenities: [] as string[],
    priceRange: [0, 2000] as [number, number],
  });

  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [openChat, setOpenChat] = useState(false);

  const router = useRouter();

  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
    handleMenuClose();
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append('name', searchQuery);
    if (filters.location) params.append('location', filters.location);
    if (filters.amenities.length > 0) params.append('amenities', filters.amenities.join(','));
    if (filters.priceRange[0] > 0) params.append('minPrice', filters.priceRange[0].toString());
    if (filters.priceRange[1] < 2000) params.append('maxPrice', filters.priceRange[1].toString());
    
    router.push(`/?${params.toString()}`);
  };

  const handleFilterChange = (key: string, value: unknown) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleAmenity = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const availableAmenities = [
    'WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Beach', 'Bar', 'Fireplace',
    'Hiking', 'Water Sports', 'Camel Rides', 'Hot Springs'
  ];

  const handleLoginSuccess = () => setOpenLoginDialog(false);
  const handleRegisterSuccess = () => setOpenRegisterDialog(false);
  const handleSwitchToRegister = () => {
    setOpenLoginDialog(false);
    setOpenRegisterDialog(true);
  };
  const handleSwitchToLogin = () => {
    setOpenRegisterDialog(false);
    setOpenLoginDialog(true);
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: '#fff',
          color: '#0a0a0a',
          borderBottom: '1px solid #e5e5e5',
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: 56, md: 64 },
            px: { xs: 1.5, md: 2 },
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            maxWidth: 1200,
            mx: 'auto',
            width: '100%',
          }}
        >
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Box
              sx={{
                fontSize: { xs: 20, md: 22 },
                fontWeight: 600,
                color: '#0a0a0a',
                display: 'flex',
                alignItems: 'center',
                letterSpacing: '-0.02em',
              }}
            >
              <img src="/logo.svg" alt="Scaper" width={28} height={28} style={{ marginRight: 8 }} />
              Scaper
            </Box>
          </Link>

          <Box
            sx={{
              flex: 1,
              maxWidth: 360,
              mx: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearch={handleSearch}
            />
            <IconButton
              size="small"
              onClick={() => setShowSearch(!showSearch)}
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1.5,
                color: '#1976d2',
                backgroundColor: 'rgba(25,118,210,0.1)',
                border: '1px solid rgba(25,118,210,0.2)',
              }}
            >
              {showSearch ? <FilterAltOff fontSize="small" /> : <FilterAltIcon fontSize="small" />}
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {session ? (
              <>
                <IconButton
                  size="small"
                  onClick={() => setOpenNotifications(true)}
                  sx={{
                    color: '#737373',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.04)', color: '#0a0a0a' },
                  }}
                  aria-label="Notifications"
                >
                  <NotificationsIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => setOpenChat(true)}
                  sx={{
                    color: '#737373',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.04)', color: '#0a0a0a' },
                  }}
                  aria-label="Chat"
                >
                  <ChatIcon fontSize="small" />
                </IconButton>
                <UserMenu
                  user={{ name: session.user?.name || '', role: (session.user as any)?.role || 'Guest' }}
                  anchorEl={anchorEl}
                  onMenuOpen={e => setAnchorEl(e.currentTarget)}
                  onMenuClose={() => setAnchorEl(null)}
                  onLogout={handleLogout}
                  onNavigate={router.push}
                />
              </>
            ) : (
              <>
                <Button
                  size="small"
                  onClick={() => setOpenLoginDialog(true)}
                  sx={{ color: '#0a0a0a', fontWeight: 500 }}
                >
                  Log in
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => setOpenRegisterDialog(true)}
                  sx={{
                    bgcolor: '#0a0a0a',
                    color: '#fff',
                    fontWeight: 500,
                    '&:hover': { bgcolor: '#262626' },
                  }}
                >
                  Sign up
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <AdvancedFilters
        showSearch={showSearch}
        filters={filters}
        handleFilterChange={handleFilterChange}
        toggleAmenity={toggleAmenity}
        availableAmenities={availableAmenities}
        handleSearch={handleSearch}
      />

      <LoginDialog
        open={openLoginDialog}
        onClose={() => setOpenLoginDialog(false)}
        onSuccess={handleLoginSuccess}
        onSwitchToRegister={handleSwitchToRegister}
      />
      <RegisterDialog
        open={openRegisterDialog}
        onClose={() => setOpenRegisterDialog(false)}
        onSuccess={handleRegisterSuccess}
        onSwitchToLogin={handleSwitchToLogin}
      />
      <Dialog open={openNotifications} onClose={() => setOpenNotifications(false)}>
        <Box sx={{ p: 2, minWidth: 320 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Notifications</Typography>
          <Typography variant="body2" sx={{ color: '#737373' }}>You have no new notifications.</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={() => setOpenNotifications(false)}>Close</Button>
          </Box>
        </Box>
      </Dialog>
      <Dialog open={openChat} onClose={() => setOpenChat(false)}>
        <Box sx={{ p: 2, minWidth: 320 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Messages</Typography>
          <Typography variant="body2" sx={{ color: '#737373' }}>This is a demo chat popup.</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={() => setOpenChat(false)}>Close</Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}
