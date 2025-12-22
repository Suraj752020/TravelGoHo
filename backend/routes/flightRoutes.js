
// ============================================
// FILE: routes/flightRoutes.js
// ============================================
const express = require('express');
const router = express.Router();
const Flight = require('../models/Flight');

// Get All Flights
router.get('/', async (req, res) => {
  try {
    const flights = await Flight.find();
    res.json({
      success: true,
      count: flights.length,
      flights
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching flights',
      error: error.message 
    });
  }
});

// Search Flights
router.get('/search', async (req, res) => {
  try {
    const { from, to } = req.query;
    
    let query = {};
    if (from) {
      query.from = new RegExp(from, 'i'); // Case insensitive search
    }
    if (to) {
      query.to = new RegExp(to, 'i');
    }

    const flights = await Flight.find(query);
    
    res.json({
      success: true,
      count: flights.length,
      flights
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error searching flights',
      error: error.message 
    });
  }
});

// Get Single Flight
router.get('/:id', async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    
    if (!flight) {
      return res.status(404).json({ 
        success: false,
        message: 'Flight not found' 
      });
    }

    res.json({
      success: true,
      flight
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching flight',
      error: error.message 
    });
  }
});

// Add New Flight (Admin)
router.post('/', async (req, res) => {
  try {
    const flight = new Flight(req.body);
    await flight.save();
    
    res.status(201).json({
      success: true,
      message: 'Flight added successfully',
      flight
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error adding flight',
      error: error.message 
    });
  }
});

module.exports = router;

