
// FILE: models/Booking.js
// ============================================
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookingType: {
    type: String,
    enum: ['flight', 'hotel'],
    required: true
  },
  // For Flight Bookings
  flightId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flight'
  },
  passengers: {
    type: Number
  },
  travelDate: {
    type: Date
  },
  // For Hotel Bookings
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel'
  },
  checkInDate: {
    type: Date
  },
  checkOutDate: {
    type: Date
  },
  numberOfGuests: {
    type: Number
  },
  numberOfRooms: {
    type: Number,
    default: 1
  },
  numberOfRooms: {
    type: Number,
    default: 1
  },
  // Snapshot of Flight/Hotel details (for history or mock bookings)
  details: {
    type: mongoose.Schema.Types.Mixed
  },
  // Common Fields
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  bookingDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', bookingSchema);