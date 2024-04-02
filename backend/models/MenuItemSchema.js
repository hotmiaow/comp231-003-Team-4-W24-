const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  name: String,
  price: Number,
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem;
