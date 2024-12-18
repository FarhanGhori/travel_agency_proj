const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    customerName: String,
    email: String,
    phoneNumber: String,
    numberOfTravelers: Number,
    specialRequests: String,
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' }, // Reference to Package model
    totalPrice: Number,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
