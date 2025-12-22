
// ============================================
// FILE: models/Hotel.js
// ============================================
const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  location: {
    type: String,
    required: true
  },
  address: {
    type: String
  },
  pricePerNight: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    default: 4.0
  },
  amenities: [{
    type: String
  }],
  availableRooms: {
    type: Number,
    default: 50
  },
  description: {
    type: String
  }
});

module.exports = mongoose.model('Hotel', hotelSchema);


// ============================================