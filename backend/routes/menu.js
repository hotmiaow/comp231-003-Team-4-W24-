const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu');

router.post('/add', async (req, res) => {
  const { name, description, price } = req.body;
  
  if (!name || !description || !price) {
    return res.status(400).json({ message: 'Please provide name, description, and price for the menu' });
  }
  
  try {
    const menu = await Menu.create({ name, description, price });
    console.log('Data save complete!');
    res.status(201).json({ message: 'Menu added successfully', menu });
  } catch (error) {
    console.error('Error adding menu:', error);
    res.status(500).json({ message: 'Failed to add menu' });
  }
});

module.exports = router;
