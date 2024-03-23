// AvailabilityRoutes.js

const express = require('express');
const router = express.Router();
const Availability = require('../models/Availability'); // Import the Mongoose model

// POST route to create availability
router.post('/availability', async (req, res) => {
    try {
        const { date, available } = req.body;

        // Validate the request body
        if (!date || !available) {
            return res.status(400).json({ message: 'Date and available fields are required' });
        }

        // Create a new availability entry
        const newAvailability = new Availability({
            date,
            available
        });

        // Save the availability entry to the database
        await newAvailability.save();

        res.status(201).json({ message: 'Availability created successfully', availability: newAvailability });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// PUT route to update availability by ID
router.put('/availability/:id', async (req, res) => {
    try {
        const availabilityId = req.params.id;
        const { date, available } = req.body;

        // Validate the request body
        if (!date || !available) {
            return res.status(400).json({ message: 'Date and available fields are required' });
        }

        // Update the availability entry in the database
        const updatedAvailability = await Availability.findByIdAndUpdate(availabilityId, { date, available }, { new: true });

        if (!updatedAvailability) {
            return res.status(404).json({ message: 'Availability not found' });
        }

        res.json({ message: 'Availability updated successfully', availability: updatedAvailability });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET route to retrieve all availability entries
router.get('/availability', async (req, res) => {
    try {
        // Retrieve all availability entries from the database
        const availability = await Availability.find();

        res.json({ availability });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
 
