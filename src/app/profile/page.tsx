'use client';

import React from 'react';
import { Container, Typography, Box, Avatar, List, ListItem, ListItemText, Divider, Paper, Alert, Button } from '@mui/material';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <Box sx={{ py: 8, textAlign: 'center' }}>Loading...</Box>;
  }

  if (status === 'unauthenticated' || !session) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Alert severity="info" action={
          <Button color="inherit" size="small" onClick={() => router.push('/')}>
            Go Home
          </Button>
        }>
          Please sign in to view your profile.
        </Alert>
      </Container>
    );
  }

  const user = session.user;

  return (
    <Box sx={{ py: 4, px: 2, maxWidth: 800, mx: 'auto' }}>
      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
        <Box display="flex" alignItems="center" gap={3} sx={{ mb: 4 }}>
          <Avatar 
            sx={{ 
                width: 90, 
                height: 90, 
                bgcolor: 'primary.main', 
                fontSize: '2rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}
          >
            {user.name?.charAt(0) || 'U'}
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="bold">{user.name}</Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>{user.email}</Typography>
            <Box sx={{ mt: 1 }}>
                <Chip 
                    label={user.role || 'Guest'} 
                    color="primary" 
                    size="small" 
                    sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }} 
                />
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Account Details</Typography>
        <List sx={{ bgcolor: '#fbfbfb', borderRadius: 2, p: 2 }}>
          <ListItem sx={{ px: 0 }}>
            <ListItemText 
                primary="Account Type" 
                secondary={user.role === 'SuperAdmin' ? 'Administrator' : user.role === 'ResortOwner' ? 'Resort Manager' : 'Guest'} 
            />
          </ListItem>
          <Divider component="li" />
          <ListItem sx={{ px: 0 }}>
            <ListItemText 
                primary="Email Address" 
                secondary={user.email} 
            />
          </ListItem>
        </List>

        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button variant="outlined" onClick={() => router.push('/bookings')}>View My Bookings</Button>
            <Button variant="contained" color="error" onClick={() => signOut()}>Sign Out</Button>
        </Box>
      </Paper>
    </Box>
  );
}

import { Chip } from '@mui/material';
