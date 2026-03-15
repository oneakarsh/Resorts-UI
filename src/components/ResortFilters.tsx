'use client';

import React from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Slider,
  Typography,
  Chip,
  Stack,
  IconButton,
} from '@mui/material';
import { Search, FilterList, Close } from '@mui/icons-material';

interface ResortFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  location: string;
  onLocationChange: (value: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (value: [number, number]) => void;
  amenities: string[];
  onAmenitiesChange: (value: string[]) => void;
}

const AVAILABLE_AMENITIES = [
  'WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Bar', 'Beach', 'Hiking', 'Parking'
];

export default function ResortFilters({
  search,
  onSearchChange,
  location,
  onLocationChange,
  priceRange,
  onPriceRangeChange,
  amenities,
  onAmenitiesChange,
}: ResortFiltersProps) {
  const handleToggleAmenity = (amenity: string) => {
    if (amenities.includes(amenity)) {
      onAmenitiesChange(amenities.filter((a) => a !== amenity));
    } else {
      onAmenitiesChange([...amenities, amenity]);
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search resorts, experiences or locations..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              bgcolor: '#fff',
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: '#737373' }} />
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="location-select-label">Location</InputLabel>
          <Select
            labelId="location-select-label"
            value={location}
            label="Location"
            onChange={(e) => onLocationChange(e.target.value)}
            sx={{ borderRadius: 3, bgcolor: '#fff' }}
          >
            <MenuItem value="">All Locations</MenuItem>
            <MenuItem value="Maldives">Maldives</MenuItem>
            <MenuItem value="Hawaii">Hawaii</MenuItem>
            <MenuItem value="Dubai">Dubai</MenuItem>
            <MenuItem value="Switzerland">Switzerland</MenuItem>
            <MenuItem value="New York">New York</MenuItem>
            <MenuItem value="Canada">Canada</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <Box sx={{ px: 1 }}>
        <Typography variant="caption" sx={{ color: '#737373', fontWeight: 600, mb: 1, display: 'block' }}>
          PRICE RANGE (PER NIGHT)
        </Typography>
        <Slider
          value={priceRange}
          onChange={(_, newValue) => onPriceRangeChange(newValue as [number, number])}
          valueLabelDisplay="auto"
          min={0}
          max={2000}
          sx={{
            color: '#0a0a0a',
            '& .MuiSlider-thumb': {
              bgcolor: '#fff',
              border: '2px solid currentColor',
              '&:hover, &.Mui-focusVisible': {
                boxShadow: '0 0 0 8px rgba(0, 0, 0, 0.08)',
              },
            },
          }}
        />
        <Box display="flex" justifyContent="space-between">
          <Typography variant="caption" sx={{ color: '#a3a3a3' }}>$0</Typography>
          <Typography variant="caption" sx={{ color: '#a3a3a3' }}>$2000+</Typography>
        </Box>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="caption" sx={{ color: '#737373', fontWeight: 600, mb: 1, display: 'block' }}>
          AMENITIES
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {AVAILABLE_AMENITIES.map((amenity) => (
            <Chip
              key={amenity}
              label={amenity}
              onClick={() => handleToggleAmenity(amenity)}
              variant={amenities.includes(amenity) ? 'filled' : 'outlined'}
              sx={{
                borderRadius: 2,
                fontWeight: 500,
                bgcolor: amenities.includes(amenity) ? '#0a0a0a' : 'transparent',
                color: amenities.includes(amenity) ? '#fff' : '#737373',
                borderColor: amenities.includes(amenity) ? '#0a0a0a' : '#e5e5e5',
                '&:hover': {
                  bgcolor: amenities.includes(amenity) ? '#262626' : '#fafafa',
                },
              }}
            />
          ))}
          {amenities.length > 0 && (
            <IconButton size="small" onClick={() => onAmenitiesChange([])} sx={{ ml: 0.5 }}>
              <Close fontSize="small" />
            </IconButton>
          )}
        </Stack>
      </Box>
    </Box>
  );
}
