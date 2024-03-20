const mongoose = require('mongoose');
const Reservation = require('./Reservation');

const restaurantSchema = new mongoose.Schema({
  name: String,
  bookings: [Reservation.schema],
  // Add other fields as necessary
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
