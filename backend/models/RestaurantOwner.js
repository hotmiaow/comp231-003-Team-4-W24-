// restaurantOwnerModel.js

const mongoose = require('mongoose');

const restaurantOwnerSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    restaurants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }]
});

const RestaurantOwner = mongoose.model('RestaurantOwner', restaurantOwnerSchema);

module.exports = RestaurantOwner;
