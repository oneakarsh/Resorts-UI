'use client';

import React from 'react';
import {
  TextField,
  InputAdornment,
  Collapse,
  Paper,
  Box,
  Slider,
  Chip,
  Typography,
  Button,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

interface FiltersProps {
  showSearch: boolean;
  filters: {
    location: string;
    checkIn: string;
    checkOut: string;
    amenities: string[];
    priceRange: [number, number];
  };
  handleFilterChange: (key: string, value: unknown) => void;
  toggleAmenity: (amenity: string) => void;
  availableAmenities: string[];
  handleSearch: () => void;
}

export default function AdvancedFilters({
  showSearch,
  filters,
  handleFilterChange,
  toggleAmenity,
  availableAmenities,
  handleSearch,
}: FiltersProps) {
  return (
    <Collapse in={showSearch}>
      <Paper
        elevation={0}
        sx={{
          mb: 2,
          p: { xs: 2, md: 2.5 },
          borderRadius: 2,
          border: '1px solid #e5e5e5',
          bgcolor: '#fff',
          maxWidth: 1200,
          mx: 'auto',
          width: { xs: 'calc(100% - 24px)', md: '100%' },
        }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 2, md: 2.5 }, alignItems: 'flex-start' }}>
          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 10px)', md: '1 1 calc(25% - 12px)' }, minWidth: 160 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Location"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationIcon sx={{ color: '#737373', fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  '& fieldset': { borderColor: '#e5e5e5' },
                  '&:hover fieldset': { borderColor: '#a3a3a3' },
                  '&.Mui-focused fieldset': { borderColor: '#0a0a0a' },
                },
              }}
            />
          </Box>
          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 10px)', md: '1 1 calc(25% - 12px)' }, minWidth: 160 }}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Check-in"
              value={filters.checkIn}
              onChange={(e) => handleFilterChange('checkIn', e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  '& fieldset': { borderColor: '#e5e5e5' },
                  '&.Mui-focused fieldset': { borderColor: '#0a0a0a' },
                },
              }}
            />
          </Box>
          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 10px)', md: '1 1 calc(25% - 12px)' }, minWidth: 160 }}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label="Check-out"
              value={filters.checkOut}
              onChange={(e) => handleFilterChange('checkOut', e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  '& fieldset': { borderColor: '#e5e5e5' },
                  '&.Mui-focused fieldset': { borderColor: '#0a0a0a' },
                },
              }}
            />
          </Box>
          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 10px)', md: '1 1 calc(25% - 12px)' }, minWidth: 160 }}>
            <Typography variant="caption" sx={{ color: '#737373', fontWeight: 500, display: 'block', mb: 0.5 }}>
              <MoneyIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
              ₹{filters.priceRange[0].toLocaleString('en-IN')} – ₹{filters.priceRange[1].toLocaleString('en-IN')}
            </Typography>
            <Slider
              value={filters.priceRange}
              onChange={(_, newValue) => handleFilterChange('priceRange', newValue)}
              valueLabelDisplay="auto"
              min={0}
              max={2000}
              step={50}
              sx={{
                color: '#0a0a0a',
                '& .MuiSlider-thumb': {
                  '&:hover, &.Mui-focusVisible': { boxShadow: '0 0 0 6px rgba(10,10,10,0.12)' },
                },
              }}
            />
          </Box>
          <Box sx={{ flex: '1 1 100%', minWidth: 0 }}>
            <Typography variant="caption" sx={{ color: '#737373', fontWeight: 500, display: 'block', mb: 1 }}>
              Amenities
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
              {availableAmenities.map((amenity) => (
                <Chip
                  key={amenity}
                  label={amenity}
                  size="small"
                  onClick={() => toggleAmenity(amenity)}
                  variant={filters.amenities.includes(amenity) ? 'filled' : 'outlined'}
                  sx={{
                    borderRadius: 1,
                    fontWeight: 500,
                    borderColor: '#e5e5e5',
                    bgcolor: filters.amenities.includes(amenity) ? '#0a0a0a' : 'transparent',
                    color: filters.amenities.includes(amenity) ? '#fff' : '#737373',
                    '&:hover': {
                      borderColor: '#0a0a0a',
                      bgcolor: filters.amenities.includes(amenity) ? '#0a0a0a' : 'rgba(0,0,0,0.04)',
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
          <Box sx={{ flex: '1 1 100%', display: 'flex', justifyContent: 'center', mt: 1 }}>
            <Button
              variant="contained"
              onClick={handleSearch}
              startIcon={<SearchIcon />}
              sx={{
                bgcolor: '#0a0a0a',
                fontWeight: 500,
                px: 3,
                '&:hover': { bgcolor: '#262626' },
              }}
            >
              Search
            </Button>
          </Box>
        </Box>
      </Paper>
    </Collapse>
  );
}
