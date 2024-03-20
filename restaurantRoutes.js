const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

router.post('/restaurants/availability', restaurantController.addAvailability);

module.exports = router;
