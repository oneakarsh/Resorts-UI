'use client';

import React from 'react';
import { Typography, Box, Avatar, List, ListItem, ListItemText, Divider, Paper } from '@mui/material';

const mockUser = {
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  joined: '2024-09-12',
};

const mockBookings = [
  { id: 'BK-001', resort: 'Paradise Resort', dates: 'May 1 – May 7, 2025' },
  { id: 'BK-002', resort: 'Forest Retreat', dates: 'Jun 15 – Jun 18, 2025' },
];

export default function ProfilePage() {
  return (
    <Box sx={{ py: 4, px: 2, maxWidth: 560, mx: 'auto' }}>
      <Box display="flex" alignItems="center" gap={2} sx={{ mb: 3 }}>
        <Avatar sx={{ width: 56, height: 56, bgcolor: '#0a0a0a', fontWeight: 600 }}>
          {mockUser.name.slice(0, 2).toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#0a0a0a' }}>
            {mockUser.name}
          </Typography>
          <Typography variant="body2" sx={{ color: '#737373' }}>{mockUser.email}</Typography>
          <Typography variant="caption" sx={{ color: '#a3a3a3' }}>
            Joined {new Date(mockUser.joined).toLocaleDateString()}
          </Typography>
        </Box>
      </Box>

      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0a0a0a', mb: 1.5 }}>
        Recent bookings
      </Typography>
      <Paper variant="outlined" sx={{ borderColor: '#e5e5e5', boxShadow: 'none', borderRadius: 2 }}>
        <List disablePadding>
          {mockBookings.map((b, i) => (
            <React.Fragment key={b.id}>
              <ListItem sx={{ py: 1.5 }}>
                <ListItemText
                  primary={b.resort}
                  secondary={b.dates}
                  primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }}
                  secondaryTypographyProps={{ fontSize: '0.8125rem', color: '#737373' }}
                />
              </ListItem>
              {i < mockBookings.length - 1 && <Divider sx={{ borderColor: '#e5e5e5' }} />}
            </React.Fragment>
          ))}
        </List>
      </Paper>

      <Typography variant="body2" sx={{ color: '#737373', mt: 2 }}>
        Mock profile. Connect to the API for real data.
      </Typography>
    </Box>
  );
}
