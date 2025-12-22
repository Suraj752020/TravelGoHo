import axios from 'axios';

// Configure your backend URL here
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

// Flights API
export const flightsAPI = {
  search: (params: {
    from?: string;
    to?: string;
    departureDate?: string;
    returnDate?: string;
    passengers?: number;
  }) => api.get('/flights', { params }),
  getById: (id: string) => api.get(`/flights/${id}`),
};

// Hotels API
export const hotelsAPI = {
  search: (params: {
    location?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: number;
  }) => api.get('/hotels', { params }),
  getById: (id: string) => api.get(`/hotels/${id}`),
};

// Bookings API
export const bookingsAPI = {
  // backend expects /bookings/flight and /bookings/hotel for creation
  create: (data: {
    type: 'flight' | 'hotel';
    itemId: string;
    userId?: string;
    details: any;
  }) => {
    if (data.type === 'flight') {
      // details should include passengers, travelDate
      return api.post('/bookings/flight', {
        flightId: data.itemId,
        travelDate: data.details.departureDate,
        passengers: data.details.passengers,
        ...data.details,
      });
    }
    // hotel
    return api.post('/bookings/hotel', {
      hotelId: data.itemId,
      checkInDate: data.details.checkIn,
      checkOutDate: data.details.checkOut,
      numberOfGuests: data.details.guests,
      numberOfRooms: data.details.numberOfRooms || 1,
      ...data.details,
    });
  },
  getAll: () => api.get('/bookings'),
  getById: (id: string) => api.get(`/bookings/${id}`),
  // backend uses PATCH /:id/cancel
  // backend uses PATCH /:id/cancel
  cancel: (id: string) => api.patch(`/bookings/${id}/cancel`),
};

// Payment API
export const paymentAPI = {
  createOrder: (amount: number, currency: string = 'INR') =>
    api.post('/payment/create-order', { amount, currency }),
  verifyPayment: (data: any) => api.post('/payment/verify', data),
};

export default api;
