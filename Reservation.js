const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  date: String,
  time: String,
  customer: String,
  numberOfTables: Number,
});

module.exports = mongoose.model('Reservation', reservationSchema);
