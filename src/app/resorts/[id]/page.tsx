'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Chip,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Divider,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Snackbar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChatIcon from '@mui/icons-material/Chat';
import { formatRupee } from '@/lib/formatRupee';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { Resort } from '@/types';
import { resortAPI, bookingAPI } from '@/lib/api';

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const id = params?.id as string;

  const [resort, setResort] = useState<Resort | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Booking form state
  const [checkInDate, setCheckInDate] = useState<Dayjs | null>(dayjs());
  const [checkOutDate, setCheckOutDate] = useState<Dayjs | null>(dayjs().add(1, 'day'));
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [amenityDialogOpen, setAmenityDialogOpen] = useState(false);
  const [selectedAmenity, setSelectedAmenity] = useState<string | null>(null);
  const [notificationOpen, setNotificationOpen] = useState(false);

  // Payment state
  const [showPayment, setShowPayment] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');

  // Nearby attractions state
  const [attractionDialogOpen, setAttractionDialogOpen] = useState(false);
  const [selectedAttraction, setSelectedAttraction] = useState<any>(null);

  // Chat state
  const [chatDialogOpen, setChatDialogOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const AMENITY_ADDON_RUPEES = 4000;

  const getNearbyAttractions = (location: string) => {
    switch (location.toLowerCase()) {
      case 'maldives':
        return [
          { 
            name: 'Coral Garden Reef', 
            distance: '1.8 km', 
            type: 'Snorkeling',
            image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop',
            description: 'Pristine coral gardens with vibrant marine life. Perfect for snorkeling enthusiasts of all levels. Crystal clear waters and abundant tropical fish species.' 
          },
          { 
            name: 'Lagoon Sandbank', 
            distance: '3.2 km', 
            type: 'Beach',
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop',
            description: 'Exclusive sandbank with pristine white sand. Ideal for swimming, sunbathing, and enjoying water sports. Breathtaking views and shallow turquoise waters.' 
          },
          { 
            name: 'Sunset Pier', 
            distance: '0.9 km', 
            type: 'Viewpoint',
            image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=600&h=400&fit=crop',
            description: 'Stunning viewpoint for sunset watching. The pier offers panoramic ocean views and is perfect for photography. Romantic spot for evening strolls.' 
          },
        ];
      case 'hawaii':
        return [
          { 
            name: 'Hidden Bay Lookout', 
            distance: '2.4 km', 
            type: 'Viewpoint',
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
            description: 'Scenic mountain viewpoint overlooking Hidden Bay. Experience breathtaking vistas of the Pacific Ocean and coastal landscapes. Best visited at sunrise or sunset.' 
          },
          { 
            name: 'Tropical Falls Trail', 
            distance: '4.1 km', 
            type: 'Hiking',
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
            description: 'Beautiful hiking trail leading to refreshing waterfalls. Immerse yourself in lush tropical vegetation and enjoy nature walks. Perfect for adventure seekers.' 
          },
          { 
            name: 'Local Farmers Market', 
            distance: '1.2 km', 
            type: 'Market',
            image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=400&fit=crop',
            description: 'Authentic farmers market with fresh local produce and crafts. Experience Hawaiian culture through local goods and traditional treats. Great place to sample fresh fruits.' 
          },
        ];
      case 'dubai':
        return [
          { 
            name: 'Desert Dune Point', 
            distance: '5.0 km', 
            type: 'Desert tour',
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
            description: 'Exciting desert safari experience with sand dunes and stunning landscapes. Enjoy camel rides, desert photography, and traditional Bedouin culture. Best in the morning or evening.' 
          },
          { 
            name: 'Old Souk District', 
            distance: '7.3 km', 
            type: 'Market',
            image: 'https://images.unsplash.com/photo-1488312508862-ae00ad38eb33?w=600&h=400&fit=crop',
            description: 'Historic market district with traditional shops and spice bazaars. Explore authentic Arabian markets, handicrafts, and textiles. Experience local culture and cuisine.' 
          },
          { 
            name: 'City Skyline Deck', 
            distance: '3.6 km', 
            type: 'Viewpoint',
            image: 'https://images.unsplash.com/photo-1512428768552-0acafc63d7cc?w=600&h=400&fit=crop',
            description: 'Premium observation deck with panoramic city views. Enjoy spectacular views of Dubai\'s iconic skyscrapers and coastal landscape. Perfect for photography.' 
          },
        ];
      default:
        return [
          { 
            name: 'Old Town Square', 
            distance: '1.4 km', 
            type: 'Historic', 
            image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop', 
            description: 'Historic square with charming cafes and street performers. Experience local culture and enjoy traditional architecture. Great for leisurely walks and people watching.' 
          },
          { 
            name: 'Riverside Promenade', 
            distance: '2.1 km', 
            type: 'Walk', 
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop', 
            description: 'Pleasant riverside walk with scenic views. Stroll along the waterfront with lush greenery and peaceful ambiance. Perfect for evening walks and relaxation.' 
          },
          { 
            name: 'Local Art Museum', 
            distance: '2.9 km', 
            type: 'Culture', 
            image: 'https://images.unsplash.com/photo-1478359866651-e92287b911d8?w=600&h=400&fit=crop', 
            description: 'Local art exhibits and contemporary galleries. Explore regional artworks and cultural exhibitions. A must-visit for art enthusiasts and cultural explorers.' 
          },
        ];
    }
  };

  useEffect(() => {
    const fetchResort = async () => {
      try {
        setLoading(true);
        const response = await resortAPI.getById(id);
        const resortData = response.data?.data || response.data;
        setResort(resortData);
      } catch (err) {
        console.error('Failed to fetch resort:', err);
        setError('Failed to load resort details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchResort();
    }
  }, [id]);

  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    return checkOutDate.diff(checkInDate, 'day');
  };

  const calculateTotalPrice = () => {
    if (!resort) return 0;
    const nights = calculateNights();
    const basePrice = nights * resort.pricePerNight;
    const amenityPrice = selectedAmenities.length * AMENITY_ADDON_RUPEES;
    return basePrice + amenityPrice;
  };

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleProceedToPayment = () => {
    if (!checkInDate || !checkOutDate || numberOfGuests < 1) {
      setError('Please fill in all required fields');
      return;
    }
    setError(null);
    // Redirect to dummy payment page with booking data encoded
    const bookingData = {
      resortId: resort?.id ?? resort?._id,
      resortName: resort?.name,
      checkInDate: checkInDate?.format('YYYY-MM-DD'),
      checkOutDate: checkOutDate?.format('YYYY-MM-DD'),
      numberOfGuests,
      selectedAmenities,
      totalPrice: calculateTotalPrice(),
    };
    const qs = encodeURIComponent(JSON.stringify(bookingData));
    window.location.href = `/dummy-payment?data=${qs}`;
  };

  const handleOpenChat = () => {
    if (status !== 'authenticated') {
      router.push('/login');
      return;
    }
    setChatDialogOpen(true);
  };

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;
    try {
      setChatLoading(true);
      // In a real app, we'd get the ownerId from the resort data
      // For now, we'll use a placeholder or the backend will handle it
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/chat/send`, {
        message: chatMessage,
        resortId: resort?.id || resort?._id,
      }, {
        headers: { Authorization: `Bearer ${session?.accessToken}` }
      });
      setChatMessage('');
      setNotificationOpen(true);
      setChatDialogOpen(false);
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message');
    } finally {
      setChatLoading(false);
    }
  };
  // Booking is handled on /dummy-payment after payment is simulated

  const amenityDetails: Record<string, { image: string; description: string }> = {
    WiFi: { image: 'https://via.placeholder.com/400x240?text=WiFi', description: 'High-speed wireless internet available throughout the property.' },
    Pool: { image: 'https://via.placeholder.com/400x240?text=Pool', description: 'Outdoor swimming pool with loungers and poolside service.' },
    Spa: { image: 'https://via.placeholder.com/400x240?text=Spa', description: 'Full-service spa offering massages and wellness treatments.' },
    Restaurant: { image: 'https://via.placeholder.com/400x240?text=Restaurant', description: 'On-site restaurant serving local and international cuisine.' },
    Bar: { image: 'https://via.placeholder.com/400x240?text=Bar', description: 'Bar with a wide selection of cocktails and beverages.' },
  };

  if (loading) {
    return (
      <>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress sx={{ color: '#0a0a0a' }} />
        </Box>

        {/* Amenity detail dialog */}
        <Dialog open={amenityDialogOpen} onClose={() => setAmenityDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{selectedAmenity}</DialogTitle>
          <DialogContent>
            {selectedAmenity && (
              <Box>
                <CardMedia component="img" height="220" image={(amenityDetails[selectedAmenity]?.image) ?? `https://via.placeholder.com/600x320?text=${encodeURIComponent(selectedAmenity)}`} />
                <Typography variant="body2" sx={{ mt: 1 }}>{(amenityDetails[selectedAmenity]?.description) ?? 'Enjoy this amenity during your stay.'}</Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAmenityDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Nearby Attraction Detail Dialog */}
        <Dialog 
          open={attractionDialogOpen} 
          onClose={() => setAttractionDialogOpen(false)} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{ sx: { borderRadius: 2 } }}
        >
          <DialogTitle sx={{ fontWeight: 600, fontSize: '1.125rem', color: '#0a0a0a', position: 'relative', pb: 1 }}>
            {selectedAttraction?.name}
            <IconButton
              onClick={() => setAttractionDialogOpen(false)}
              sx={{ position: 'absolute', right: 8, top: 8 }}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ pt: 0 }}>
            {selectedAttraction && (
              <Box>
                <CardMedia 
                  component="img" 
                  height="240" 
                  image={selectedAttraction.image || `https://via.placeholder.com/600x300?text=${encodeURIComponent(selectedAttraction.name)}`}
                  alt={selectedAttraction.name}
                  sx={{ borderRadius: 2, my: 2, objectFit: 'cover' }}
                />
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={selectedAttraction.type}
                    size="small"
                    sx={{
                      fontWeight: 500,
                      fontSize: '0.8rem',
                      bgcolor: 'rgba(0,0,0,0.06)',
                      color: '#0a0a0a',
                      mb: 1,
                    }}
                  />
                </Box>
                <Typography variant="body2" sx={{ color: '#737373', lineHeight: 1.7, mb: 1.5 }}>
                  {selectedAttraction.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', color: '#737373' }}>
                  <Typography variant="caption" sx={{ fontWeight: 500 }}>📍 {selectedAttraction.distance}</Typography>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button 
              onClick={() => setAttractionDialogOpen(false)}
              variant="contained"
              sx={{ bgcolor: '#0a0a0a', color: '#fff', fontWeight: 500, '&:hover': { bgcolor: '#262626' } }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={notificationOpen} message="Action completed" autoHideDuration={2000} onClose={() => setNotificationOpen(false)} />
      </>
    );
  }

  if (error && !resort) {
    return (
      <Box sx={{ maxWidth: 560, mx: 'auto', px: 2, py: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
      </Box>
    );
  }

  if (!resort) {
    return (
      <Box sx={{ maxWidth: 560, mx: 'auto', px: 2, py: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>Resort not found</Alert>
      </Box>
    );
  }

  const attractions = getNearbyAttractions(resort.location);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ py: 4, px: 2, maxWidth: 1100, mx: 'auto' }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 600, color: '#0a0a0a', mb: 0.5 }}>
          Book {resort.name}
        </Typography>
        <Typography variant="body2" sx={{ color: '#737373', mb: 2 }}>
          {resort.location}
        </Typography>

        <Grid container spacing={3}>
            {/* Resort Details */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Card variant="outlined" sx={{ borderColor: '#e5e5e5', boxShadow: 'none', borderRadius: 2, overflow: 'hidden' }}>
                <CardMedia
                  component="img"
                  height="280"
                  image={(((resort as any).images?.[0]) ?? resort.image) || 'https://via.placeholder.com/400x300?text=No+Image'}
                  alt={resort.name}
                />
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#0a0a0a', mb: 1 }}>
                    {resort.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#737373', mb: 1.5, lineHeight: 1.6 }}>
                    {resort.description}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#737373', mb: 1.5 }}>
                    {resort.location}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0a0a0a', mb: 2 }}>
                    {formatRupee(resort.pricePerNight)} per night
                  </Typography>

                  <Box sx={{ mb: 3 }}>
                    <Button
                      variant="outlined"
                      startIcon={<ChatIcon />}
                      onClick={handleOpenChat}
                      sx={{
                        borderColor: '#0a0a0a',
                        color: '#0a0a0a',
                        fontWeight: 500,
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.04)', borderColor: '#0a0a0a' },
                      }}
                    >
                      Chat with Owner
                    </Button>
                  </Box>

                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0a0a0a', mb: 1 }}>
                    Amenities
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
                    {resort.amenities.map((amenity) => {
                      const meta = amenityDetails[amenity] ?? { image: `https://via.placeholder.com/400x240?text=${encodeURIComponent(amenity)}`, description: 'Experience this amenity during your stay.' };
                      return (
                        <Card key={amenity} variant="outlined" sx={{ minWidth: 220, borderRadius: 1.5, cursor: 'pointer' }} onClick={() => { setSelectedAmenity(amenity); setAmenityDialogOpen(true); }}>
                          <CardMedia component="img" height="120" image={meta.image} />
                          <CardContent>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{amenity}</Typography>
                            <Typography variant="caption" sx={{ color: '#737373' }}>{meta.description.slice(0, 60)}...</Typography>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

          {/* Booking Form */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper variant="outlined" sx={{ p: 2.5, borderColor: '#e5e5e5', boxShadow: 'none', borderRadius: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0a0a0a', mb: 2 }}>
                Booking details
              </Typography>

              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <DatePicker
                  label="Check-in Date"
                  value={checkInDate}
                  onChange={setCheckInDate}
                  minDate={dayjs()}
                  slotProps={{ textField: { fullWidth: true } }}
                />

                <DatePicker
                  label="Check-out Date"
                  value={checkOutDate}
                  onChange={setCheckOutDate}
                  minDate={checkInDate || dayjs()}
                  slotProps={{ textField: { fullWidth: true } }}
                />

                <TextField
                  label="Number of Guests"
                  type="number"
                  value={numberOfGuests}
                  onChange={(e) => setNumberOfGuests(parseInt(e.target.value) || 1)}
                  inputProps={{ min: 1, max: resort.maxGuests }}
                  fullWidth
                />

                <FormControl fullWidth>
                  <InputLabel>Selected Amenities</InputLabel>
                  <Select
                    multiple
                    value={selectedAmenities}
                    onChange={(e) => setSelectedAmenities(e.target.value as string[])}
                    renderValue={(selected) => selected.join(', ')}
                  >
                    {resort.amenities.map((amenity) => (
                      <MenuItem key={amenity} value={amenity}>
                        {amenity}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Divider sx={{ my: 2 }} />

                <Box>
                  <Typography variant="body2">
                    {calculateNights()} nights × {formatRupee(resort.pricePerNight)} = {formatRupee(calculateNights() * resort.pricePerNight)}
                  </Typography>
                  <Typography variant="body2">
                    Amenities: {selectedAmenities.length} × {formatRupee(AMENITY_ADDON_RUPEES)} = {formatRupee(selectedAmenities.length * AMENITY_ADDON_RUPEES)}
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    Total: {formatRupee(calculateTotalPrice())}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  size="medium"
                  onClick={handleProceedToPayment}
                  fullWidth
                  sx={{
                    py: 1.25,
                    fontWeight: 500,
                    bgcolor: '#0a0a0a',
                    '&:hover': { bgcolor: '#262626' },
                  }}
                >
                  Proceed to payment
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#0a0a0a', mb: 1.5 }}>
            Nearby attractions
          </Typography>
          <Typography variant="body2" sx={{ color: '#737373', mb: 2, display: 'block' }}>
            Swipe or scroll to explore
          </Typography>
          <Box
            className="attractions-swipe"
            sx={{
              display: 'flex',
              gap: 2,
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              '& > *': { scrollSnapAlign: 'start', flexShrink: 0 },
              scrollbarWidth: 'thin',
            }}
          >
            {attractions.map((attraction) => (
              <Card
                key={attraction.name}
                variant="outlined"
                onClick={() => {
                  setSelectedAttraction(attraction);
                  setAttractionDialogOpen(true);
                }}
                sx={{
                  minWidth: 280,
                  maxWidth: 320,
                  borderRadius: 2,
                  borderColor: '#e5e5e5',
                  boxShadow: 'none',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    borderColor: '#d4d4d4', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                {attraction.image && (
                  <CardMedia
                    component="img"
                    height="160"
                    image={attraction.image}
                    alt={attraction.name}
                    sx={{ objectFit: 'cover' }}
                  />
                )}
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0a0a0a', mb: 0.5 }}>
                    {attraction.name}
                  </Typography>
                  <Chip
                    label={attraction.type}
                    size="small"
                    sx={{
                      fontSize: '0.75rem',
                      height: 22,
                      mb: 1,
                      bgcolor: 'rgba(0,0,0,0.06)',
                      color: '#0a0a0a',
                      border: 'none',
                    }}
                  />
                  <Typography variant="body2" sx={{ color: '#737373' }}>
                    {attraction.distance} away
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
        <Snackbar open={notificationOpen} message="Message sent successfully!" autoHideDuration={3000} onClose={() => setNotificationOpen(false)} />

        {/* Chat Dialog */}
        <Dialog open={chatDialogOpen} onClose={() => setChatDialogOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ fontWeight: 600 }}>Chat with Owner</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ mb: 2, color: '#737373' }}>
              Ask questions about {resort.name} or request special arrangements.
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Type your message here..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              variant="outlined"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button onClick={() => setChatDialogOpen(false)} sx={{ color: '#737373' }}>Cancel</Button>
            <Button
              onClick={handleSendMessage}
              variant="contained"
              disabled={chatLoading || !chatMessage.trim()}
              sx={{ bgcolor: '#0a0a0a', '&:hover': { bgcolor: '#262626' } }}
            >
              {chatLoading ? <CircularProgress size={24} color="inherit" /> : 'Send Message'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}