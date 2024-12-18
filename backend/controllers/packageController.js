const Package = require('../models/Package');

// Update an existing package
exports.updatePackage = async (req, res) => {
    try {
        const { id } = req.params;  // Get the package ID from the URL
        const updateData = req.body;  // Get the data to update from the request body

        // Find the package by ID and update it
        const updatedPackage = await Package.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedPackage) {
            return res.status(404).json({ message: 'Package not found' });
        }

        res.status(200).json({
            message: 'Package updated successfully',
            data: updatedPackage
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update package', error: error.message });
    }
};
