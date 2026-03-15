'use client';

import React from 'react';
import {
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';

interface UserMenuProps {
  user: { name: string; role: string };
  anchorEl: HTMLElement | null;
  isAuthenticated: boolean;
  onMenuOpen: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onMenuClose: () => void;
  onLogout: () => void;
  onLogin: () => void;
  onRegister: () => void;
  onNavigate: (path: string) => void;
}

export default function UserMenu({
  user,
  anchorEl,
  isAuthenticated,
  onMenuClose,
  onLogout,
  onLogin,
  onRegister,
  onNavigate,
}: UserMenuProps) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onMenuClose}
      PaperProps={{
        elevation: 0,
        sx: {
          borderRadius: 2,
          minWidth: 200,
          mt: 1.5,
          border: '1px solid #e5e5e5',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          '& .MuiMenuItem-root': {
            fontSize: '0.875rem',
            py: 1.25,
            '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' },
          },
        },
      }}
    >
      {!isAuthenticated ? (
        [
          <MenuItem key="login" onClick={() => { onMenuClose(); onLogin(); }} sx={{ fontWeight: 600 }}>
            Log in
          </MenuItem>,
          <MenuItem key="signup" onClick={() => { onMenuClose(); onRegister(); }}>
            Sign up
          </MenuItem>,
          <Divider key="div1" sx={{ my: 1, borderColor: '#e5e5e5' }} />,
          <MenuItem key="host" onClick={() => { onMenuClose(); onNavigate('/dashboard/resorts/new'); }}>
            Airbnb your home
          </MenuItem>,
          <MenuItem key="help" onClick={() => onMenuClose()}>
            Help Center
          </MenuItem>
        ]
      ) : (
        [
          <MenuItem key="bookings" onClick={() => { onMenuClose(); onNavigate('/bookings'); }}>
            My Bookings
          </MenuItem>,
          <MenuItem key="messages" onClick={() => { onMenuClose(); onNavigate('/messages'); }}>
            Messages
          </MenuItem>,
          <MenuItem key="profile" onClick={() => { onMenuClose(); onNavigate('/profile'); }}>
            Profile
          </MenuItem>,
          (user.role === 'admin' || user.role === 'superadmin') && (
            <MenuItem key="admin" onClick={() => { onMenuClose(); onNavigate('/admin'); }}>
              Admin Toolbar
            </MenuItem>
          ),
          (user.role === 'resort_owner') && (
            <MenuItem key="dashboard" onClick={() => { onMenuClose(); onNavigate('/dashboard'); }}>
              Owner Dashboard
            </MenuItem>
          ),
          <Divider key="div2" sx={{ my: 1, borderColor: '#e5e5e5' }} />,
          <MenuItem key="logout" onClick={onLogout} sx={{ color: '#dc2626', fontWeight: 500 }}>
            Log out
          </MenuItem>
        ]
      )}
    </Menu>
  );
}
