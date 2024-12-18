const express = require('express');
const { getAllPackages, createPackage, deletePackage, updatePackage } = require('../controllers/packageController');
const router = express.Router();

// Route to get all packages
router.get('/', getAllPackages);

// Route to create a new package
router.post('/', createPackage);

// Route to update a package by ID
router.put('/:id', updatePackage);  // New PUT route for updating a package

// Route to delete a package by ID
router.delete('/:id', deletePackage);

module.exports = router;
