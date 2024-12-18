const Package = require('../models/Package');
const Booking = require('../models/Booking');

// Add a new travel package
exports.addPackage = async (req, res) => {
    try {
        const { title, description, price, availableDates, image } = req.body;

        // Validate required fields
        if (!title || !description || !price || !availableDates || !image) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Validate price
        if (typeof price !== 'number' || price <= 0) {
            return res.status(400).json({ message: 'Price should be a positive number' });
        }

        // Validate availableDates (ensure it's an array)
        if (!Array.isArray(availableDates) || availableDates.length === 0) {
            return res.status(400).json({ message: 'Available Dates should be an array and cannot be empty' });
        }

        // Create a new package
        const newPackage = new Package({
            title,
            description,
            price,
            availableDates,
            image,
            createdAt: new Date(),
        });

        // Save the new package to the database
        const savedPackage = await newPackage.save();

        res.status(201).json({
            success: true,
            message: 'Package added successfully',
            data: savedPackage,
        });
    } catch (error) {
        console.error('Error adding package:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add package',
            error: error.message,
        });
    }
};

// Update an existing package
exports.updatePackage = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (!updateData || Object.keys(updateData).length === 0) {
            return res.status(400).json({ error: "No update data provided" });
        }

        // Update the package by ID
        const updatedPackage = await Package.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedPackage) {
            return res.status(404).json({
                success: false,
                message: 'Package not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Package updated successfully',
            data: updatedPackage,
        });
    } catch (error) {
        console.error('Error updating package:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update package',
            error: error.message,
        });
    }
};

// Delete a package by ID
exports.deletePackage = async (req, res) => {
    try {
        const { id } = req.params;

        // Delete the package by ID
        const deletedPackage = await Package.findByIdAndDelete(id);

        if (!deletedPackage) {
            return res.status(404).json({
                success: false,
                message: 'Package not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Package deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting package:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete package',
            error: error.message,
        });
    }
};

// View all bookings
exports.viewAllBookings = async (req, res) => {
    try {
        // Fetch all bookings from the database and populate package details
        const bookings = await Booking.find().populate('packageId', 'title price');

        res.status(200).json({
            success: true,
            message: 'Bookings fetched successfully',
            data: bookings,
        });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch bookings',
            error: error.message,
        });
    }
};

// Delete a booking by ID
exports.deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;

        // Delete the booking by ID
        const deletedBooking = await Booking.findByIdAndDelete(id);

        if (!deletedBooking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Booking deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete booking',
            error: error.message,
        });
    }
};
