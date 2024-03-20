const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { db } = require('./conn'); // Import MongoDB connection instance from conn.js

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Define MongoDB schemas and models
const reservationSchema = new mongoose.Schema({
  date: String,
  time: String,
  customer: String
});
const Reservation = mongoose.model('Reservation', reservationSchema);

const restaurantSchema = new mongoose.Schema({
  name: String,
  bookings: [reservationSchema],
  menu: [{ name: String, price: Number }],
  performanceAnalytics: {
    revenue: Number,
    reservations: Number,
    ratings: Number
  }
});
const Restaurant = mongoose.model('Restaurant', restaurantSchema);

// API for Restaurant Manager Availability Management
app.post('/api/availability', async (req, res) => {
  try {
    const { restaurant_id, date, time_slots } = req.body;

    // Update availability data in the database
    const restaurant = await Restaurant.findOneAndUpdate(
      { _id: restaurant_id },
      { $addToSet: { bookings: { $each: time_slots.map(time => ({ date, time })) } } },
      { new: true }
    );

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.json({ message: 'Availability updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating availability' });
  }
});

// API for Restaurant Owner Data Access
app.get('/api/restaurants/:restaurant_id/data', async (req, res) => {
  try {
    const { restaurant_id } = req.params;

    // Retrieve data related to the specified restaurant from the database
    const restaurant = await Restaurant.findById(restaurant_id);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.json({ data: restaurant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving restaurant data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
