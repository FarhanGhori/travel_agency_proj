const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Example route for admin panel (you can keep or modify this)
router.get('/', (req, res) => {
    res.send('Admin panel is working!');
});

// Routes for managing packages
router.post('/packages', adminController.addPackage); // Add new package
router.put('/packages/:id', adminController.updatePackage); // Update package by ID
router.delete('/packages/:id', adminController.deletePackage); // Delete package by ID

// Route to view all bookings
router.get('/bookings', adminController.viewAllBookings); // Get all bookings

// Route to delete a booking (you can add this if needed)
router.delete('/bookings/:id', adminController.deleteBooking); // Delete a booking by ID

module.exports = router;
