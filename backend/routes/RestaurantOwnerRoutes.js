// restaurantOwnerRoutes.js

const express = require('express');
const router = express.Router();
const restaurantOwnerController = require('./restaurantOwnerController');

// Route to register a new restaurant owner
router.post('/register', restaurantOwnerController.registerOwner);

// Route to login as a restaurant owner
router.post('/login', restaurantOwnerController.loginOwner);

// Route to retrieve profile information of the restaurant owner
router.get('/:ownerId', restaurantOwnerController.getOwnerProfile);

// Route to update profile information of the restaurant owner
router.put('/:ownerId', restaurantOwnerController.updateOwnerProfile);

// Add more routes for other owner operations

module.exports = router;
