const Restaurant = require('../models/Restaurant');

exports.addAvailability = async (req, res) => {
  const { restaurantId, availability } = req.body;
  try {
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      restaurantId,
      { $push: { bookings: availability } },
      { new: true }
    );
    res.status(200).json(updatedRestaurant);
  } catch (error) {
    res.status(500).json({ message: 'Error adding availability', error });
  }
};
