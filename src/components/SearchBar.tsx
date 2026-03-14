'use client';

import React from 'react';
import {
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
} from '@mui/icons-material';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch?: () => void;
}

export default function SearchBar({ searchQuery, setSearchQuery, onSearch }: SearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch();
    }
  };

  return (
    <TextField
      fullWidth
      placeholder="Search resorts..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      onKeyDown={handleKeyDown}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: 'rgba(0,0,0,0.6)' }} />
          </InputAdornment>
        ),
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 3,
          backgroundColor: 'rgba(255,255,255,0.9)',
          border: '1px solid rgba(0,0,0,0.1)',
          transition: 'all 0.2s ease',
          '& fieldset': {
            border: 'none',
          },
          '&:hover': {
            backgroundColor: 'white',
            borderColor: 'rgba(25,118,210,0.3)',
            boxShadow: '0 2px 8px rgba(25,118,210,0.1)',
          },
          '&.Mui-focused': {
            backgroundColor: 'white',
            borderColor: '#1976d2',
            boxShadow: '0 0 0 3px rgba(25,118,210,0.1)',
          },
          '& input': {
            color: '#333',
            '&::placeholder': {
              color: 'rgba(0,0,0,0.5)',
              opacity: 1,
            },
          },
        },
      }}
    />
  );
}