const Booking = require('../models/Booking'); // Import the Booking model
const Package = require('../models/Package'); // Import the Package model (needed for price calculation)

// Create a new booking
exports.createBooking = async (req, res) => {
    try {
        const { customerName, email, phoneNumber, numberOfTravelers, specialRequests, packageId } = req.body;

        // Fetch the selected package by ID to calculate the total price
        const selectedPackage = await Package.findById(packageId);
        if (!selectedPackage) {
            return res.status(404).json({ message: 'Package not found' });
        }

        // Calculate the total price based on the number of travelers
        const totalPrice = selectedPackage.price * numberOfTravelers;

        // Create a new booking
        const newBooking = new Booking({
            customerName,
            email,
            phoneNumber,
            numberOfTravelers,
            specialRequests,
            packageId,
            totalPrice,
        });

        // Save the booking to the database
        const savedBooking = await newBooking.save();
        res.status(201).json(savedBooking); // Return the saved booking as response
    } catch (error) {
        res.status(500).json({ error: 'Failed to create booking' });
    }
};

// Get all bookings
exports.getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('packageId'); // Populate package details
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
};

// Get a single booking by ID
exports.getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('packageId'); // Populate package details
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json(booking); // Return the booking details
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch booking' });
    }
};

// Delete a booking by ID
exports.deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id); // Delete the booking by ID
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete booking' });
    }
};

// Update a booking by ID
exports.updateBooking = async (req, res) => {
    try {
        // Update booking details by ID and return the updated booking
        const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json(updatedBooking); // Return the updated booking
    } catch (error) {
        res.status(500).json({ error: 'Failed to update booking' });
    }
};
