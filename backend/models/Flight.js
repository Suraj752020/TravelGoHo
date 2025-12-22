// ============================================
// FILE: models/Flight.js
// ============================================
const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  airline: {
    type: String,
    required: true
  },
  flightNumber: {
    type: String,
    required: true
  },
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  departureTime: {
    type: String,
    required: true
  },
  arrivalTime: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  availableSeats: {
    type: Number,
    default: 100
  }
});

module.exports = mongoose.model('Flight', flightSchema);

