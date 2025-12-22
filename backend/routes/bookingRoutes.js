
// ============================================
// FILE: routes/bookingRoutes.js
// ============================================
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Flight = require('../models/Flight');
const Hotel = require('../models/Hotel');
const auth = require('../middleware/authMiddleware');

// Book a Flight
// Book a Flight
router.post('/flight', auth, async (req, res) => {
  try {
    const { flightId, passengers, travelDate, ...otherDetails } = req.body;
    const userId = req.user.id; // Get user from token

    let flight = null;
    let totalPrice = 0;
    const isMock = flightId && flightId.startsWith('mock_');

    if (!isMock) {
      // Get flight details
      flight = await Flight.findById(flightId);
      if (!flight) {
        return res.status(404).json({
          success: false,
          message: 'Flight not found'
        });
      }

      if (!passengers || passengers < 1) {
        return res.status(400).json({
          success: false,
          message: 'Passengers must be at least 1'
        });
      }

      // Check availability
      if (flight.availableSeats < passengers) {
        return res.status(400).json({
          success: false,
          message: 'Not enough seats available'
        });
      }
      totalPrice = flight.price * passengers;
    } else {
      // MOCK MODE
      // We expect price and other details to be passed in body
      const price = Number(otherDetails.price || 0);
      totalPrice = price * (passengers || 1);
    }

    // Create booking
    const booking = new Booking({
      userId,
      bookingType: 'flight',
      flightId: isMock ? null : flightId, // store null if mock to avoid CastError
      passengers,
      travelDate,
      totalPrice,
      status: 'confirmed',
      details: { ...otherDetails, isMock: true, flightId } // Store snapshot
    });

    await booking.save();

    if (!isMock && flight) {
      // Update available seats
      flight.availableSeats -= passengers;
      await flight.save();
    }

    res.status(201).json({
      success: true,
      message: 'Flight booked successfully',
      booking
    });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({
      success: false,
      message: 'Booking failed',
      error: error.message
    });
  }
});

// Book a Hotel
router.post('/hotel', auth, async (req, res) => {
  try {
    const { hotelId, checkInDate, checkOutDate, numberOfGuests, numberOfRooms, ...otherDetails } = req.body;
    const userId = req.user.id; // Get user from token

    let hotel = null;
    let totalPrice = 0;
    const isMock = hotelId && hotelId.startsWith('mock_');

    // Calculate number of nights
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    // Validate dates
    if (isNaN(nights) || nights <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid dates provided"
      });
    }

    if (!isMock) {
      // Get hotel details
      hotel = await Hotel.findById(hotelId);
      if (!hotel) {
        return res.status(404).json({
          success: false,
          message: 'Hotel not found'
        });
      }

      if (!numberOfGuests || numberOfGuests < 1) {
        return res.status(400).json({
          success: false,
          message: 'Number of guests must be at least 1'
        });
      }

      // Check availability
      if (hotel.availableRooms < numberOfRooms) {
        return res.status(400).json({
          success: false,
          message: 'Not enough rooms available'
        });
      }
      totalPrice = hotel.pricePerNight * nights * numberOfRooms;
    } else {
      // MOCK MODE
      // Expect price in otherDetails
      const price = Number(otherDetails.price || otherDetails.pricePerNight || 0);
      totalPrice = price * nights * (numberOfRooms || 1);
    }

    // Create booking
    const booking = new Booking({
      userId,
      bookingType: 'hotel',
      hotelId: isMock ? null : hotelId,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      numberOfRooms,
      totalPrice,
      status: 'confirmed',
      details: { ...otherDetails, isMock: true, hotelId, location: otherDetails.location || 'Unknown' }
    });

    await booking.save();

    if (!isMock && hotel) {
      // Update available rooms
      hotel.availableRooms -= numberOfRooms;
      await hotel.save();
    }

    res.status(201).json({
      success: true,
      message: 'Hotel booked successfully',
      booking
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Booking failed',
      error: error.message
    });
  }
});

// Get All Bookings for a User
router.get('/user/:userId', async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId })
      .populate('flightId')
      .populate('hotelId')
      .sort({ bookingDate: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
});

// Get Single Booking
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('flightId')
      .populate('hotelId')
      .populate('userId', '-password');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
      error: error.message
    });
  }
});

// Cancel Booking
router.patch('/:id/cancel', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Restore availability
    if (booking.bookingType === 'flight') {
      const flight = await Flight.findById(booking.flightId);
      if (flight) {
        flight.availableSeats += booking.passengers;
        await flight.save();
      }
    } else if (booking.bookingType === 'hotel') {
      const hotel = await Hotel.findById(booking.hotelId);
      if (hotel) {
        hotel.availableRooms += booking.numberOfRooms;
        await hotel.save();
      }
    }

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling booking',
      error: error.message
    });
  }
});

// Get All Bookings (Admin / Debug)
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('flightId')
      .populate('hotelId')
      .populate('userId', '-password')
      .sort({ bookingDate: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
});

module.exports = router;