// ============================================
// FILE: server.js (Main Entry Point)
// ============================================
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to Database
connectDB();

// Import Routes
const authRoutes = require('./routes/authRoutes');
const flightRoutes = require('./routes/flightRoutes');
const hotelRoutes = require('./routes/hotelRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payment', paymentRoutes);

// Test Route
app.get('/', (req, res) => {
  res.json({ message: '🚀 TravelGo API is running!' });
});

// 🔴 ADD THIS DEBUG ROUTE
app.get('/__test', (req, res) => {
  res.status(200).json({ ok: true, message: "Server reachable" });
});



app.listen(5050, "0.0.0.0", () => {
  console.log("Server running on http://localhost:5050");
});
