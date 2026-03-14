'use client';

import React from 'react';
import {
  Button,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Typography,
} from '@mui/material';

interface UserMenuProps {
  user: { name: string; role: string };
  anchorEl: HTMLElement | null;
  onMenuOpen: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onMenuClose: () => void;
  onLogout: () => void;
  onNavigate: (path: string) => void;
}

export default function UserMenu({
  user,
  anchorEl,
  onMenuOpen,
  onMenuClose,
  onLogout,
  onNavigate,
}: UserMenuProps) {
  return (
    <>
      <Button
        color="inherit"
        onClick={onMenuOpen}
        sx={{
          textTransform: 'none',
          display: 'flex',
          gap: 1,
          fontWeight: 500,
          color: '#0a0a0a',
          borderRadius: 1.5,
          px: 1.5,
          py: 0.75,
          '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' },
        }}
      >
        <Avatar sx={{ width: 32, height: 32, bgcolor: '#0a0a0a', fontWeight: 600, fontSize: '0.875rem' }}>
          {user.name.charAt(0).toUpperCase()}
        </Avatar>
        <Typography sx={{ display: { xs: 'none', sm: 'block' }, fontSize: '0.875rem' }}>
          {user.name}
        </Typography>
      </Button>
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
        <MenuItem onClick={() => { onMenuClose(); onNavigate('/bookings'); }}>
          My Bookings
        </MenuItem>
        <MenuItem onClick={() => { onMenuClose(); onNavigate('/profile'); }}>
          Profile
        </MenuItem>
        {(user.role === 'admin' || user.role === 'superadmin') && (
          <MenuItem onClick={() => { onMenuClose(); onNavigate('/admin'); }}>
            Admin
          </MenuItem>
        )}
        {user.role === 'superadmin' && (
          <MenuItem onClick={() => { onMenuClose(); onNavigate('/roles'); }}>
            Roles & Permissions
          </MenuItem>
        )}
        <Divider sx={{ my: 1, borderColor: '#e5e5e5' }} />
        <MenuItem
          onClick={onLogout}
          sx={{ color: '#dc2626', fontWeight: 500 }}
        >
          Log out
        </MenuItem>
      </Menu>
    </>
  );
}
