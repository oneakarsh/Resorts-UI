'use client';

import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps) {
  return (
    <TextField
      fullWidth
      placeholder="Search resorts..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      size="small"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: '#737373', fontSize: 20 }} />
          </InputAdornment>
        ),
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 1.5,
          bgcolor: '#fafafa',
          fontSize: '0.875rem',
          '& fieldset': { borderColor: 'transparent' },
          '&:hover fieldset': { borderColor: '#e5e5e5' },
          '&.Mui-focused fieldset': { borderColor: '#0a0a0a', borderWidth: 1 },
          '& input::placeholder': { color: '#737373', opacity: 1 },
        },
      }}
    />
  );
}
