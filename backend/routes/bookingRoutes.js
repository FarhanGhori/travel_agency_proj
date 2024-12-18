const express = require('express');
const { createBooking, getBookings, getBookingById, deleteBooking, updateBooking } = require('../controllers/bookingController');
const router = express.Router();

// Route to create a new booking
router.post('/', createBooking);

// Route to get all bookings
router.get('/', getBookings);

// Route to get a single booking by ID
router.get('/:id', getBookingById);

// Route to delete a booking by ID
router.delete('/:id', deleteBooking);

// Route to update a booking by ID
router.put('/:id', updateBooking);

module.exports = router;
