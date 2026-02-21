'use client';

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
} from '@mui/material';
import {
  FilterList as FilterListIcon,
  Tune as TuneOffIcon,
  NotificationsNone as NotificationsIcon,
  ChatBubbleOutline as ChatIcon,
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

  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.log('[Navbar] session=', session, 'status=', status);
  }

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

  const router = useRouter();

  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
    handleMenuClose();
  };

  const handleSearch = () => {
    console.log('Searching for:', searchQuery, filters);
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
              maxWidth: 320,
              mx: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
            <IconButton
              size="small"
              onClick={() => setShowSearch(!showSearch)}
              sx={{
                color: '#737373',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.04)', color: '#0a0a0a' },
              }}
            >
              {showSearch ? <TuneOffIcon fontSize="small" /> : <FilterListIcon fontSize="small" />}
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {session ? (
              <>
                <IconButton
                  size="small"
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
                  sx={{
                    color: '#737373',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.04)', color: '#0a0a0a' },
                  }}
                  aria-label="Chat"
                >
                  <ChatIcon fontSize="small" />
                </IconButton>
                <UserMenu
                  user={{ name: session.user?.name || '', role: (session.user as { role?: string })?.role || 'user' }}
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
    </>
  );
}
