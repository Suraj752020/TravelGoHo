
// ============================================
// FILE: routes/hotelRoutes.js
// ============================================
const express = require('express');
const router = express.Router();
const Hotel = require('../models/Hotel');

// Get All Hotels
router.get('/', async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.json({
      success: true,
      count: hotels.length,
      hotels
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching hotels',
      error: error.message 
    });
  }
});

// Search Hotels
router.get('/search', async (req, res) => {
  try {
    const { location } = req.query;
    
    let query = {};
    if (location) {
      query.location = new RegExp(location, 'i');
    }

    const hotels = await Hotel.find(query);
    
    res.json({
      success: true,
      count: hotels.length,
      hotels
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error searching hotels',
      error: error.message 
    });
  }
});

// Get Single Hotel
router.get('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    
    if (!hotel) {
      return res.status(404).json({ 
        success: false,
        message: 'Hotel not found' 
      });
    }

    res.json({
      success: true,
      hotel
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching hotel',
      error: error.message 
    });
  }
});

// Add New Hotel (Admin)
router.post('/', async (req, res) => {
  try {
    const hotel = new Hotel(req.body);
    await hotel.save();
    
    res.status(201).json({
      success: true,
      message: 'Hotel added successfully',
      hotel
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error adding hotel',
      error: error.message 
    });
  }
});

module.exports = router;