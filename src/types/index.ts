export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  role: 'Guest' | 'Admin' | 'SuperAdmin' | 'ResortOwner';
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Resort {
  id?: string;
  _id?: string;
  name: string;
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
  pricePerNight: number;
  amenities: string[];
  maxGuests?: number;
  rooms?: any;
  ownerId?: string | User;
  verified?: boolean;
  images?: string[];
  rating?: number;
}

export interface Booking {
  id: string;
  _id?: string;
  userId: string | User;
  resortId: string | any;
  resort?: Resort;
  roomId?: string | any;
  checkIn: string;
  checkOut: string;
  checkInDate?: string;
  checkOutDate?: string;
  guests: number;
  numberOfGuests?: number;
  totalPrice: number;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed' | 'pending' | 'confirmed' | 'cancelled';
  paymentStatus?: 'Unpaid' | 'Paid' | 'Refunded';
  createdAt: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}
