// restaurantOwnerController.js

const RestaurantOwner = require('./restaurantOwnerModel');

exports.registerOwner = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const owner = new RestaurantOwner({ username, email, password });
        await owner.save();
        res.status(201).json({ message: 'Restaurant owner registered successfully', data: owner });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering restaurant owner' });
    }
};

exports.getOwnerById = async (req, res) => {
    try {
        const owner = await RestaurantOwner.findById(req.params.id);
        if (!owner) {
            return res.status(404).json({ message: 'Restaurant owner not found' });
        }
        res.json({ data: owner });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving restaurant owner' });
    }
};

exports.updateOwner = async (req, res) => {
    try {
        const { username, email } = req.body;
        const updatedOwner = await RestaurantOwner.findByIdAndUpdate(req.params.id, { username, email }, { new: true });
        if (!updatedOwner) {
            return res.status(404).json({ message: 'Restaurant owner not found' });
        }
        res.json({ message: 'Restaurant owner updated successfully', data: updatedOwner });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating restaurant owner' });
    }
};

exports.deleteOwner = async (req, res) => {
    try {
        const deletedOwner = await RestaurantOwner.findByIdAndDelete(req.params.id);
        if (!deletedOwner) {
            return res.status(404).json({ message: 'Restaurant owner not found' });
        }
        res.json({ message: 'Restaurant owner deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting restaurant owner' });
    }
};

