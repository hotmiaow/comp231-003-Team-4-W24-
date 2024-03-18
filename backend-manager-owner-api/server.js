const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Custom dummy database to store availability data
let availabilityData = {};

// Custom database to store restaurant data
let restaurantData = {
    "restaurant1": {
        bookings: [
            { date: '2024-03-10', time: '18:00', customer: 'John Doe' },
            { date: '2024-03-11', time: '19:00', customer: 'Jane Smith' }
        ],
        menu: [
            { name: 'Burger', price: 10 },
            { name: 'Pizza', price: 12 }
        ],
        performanceAnalytics: {
            revenue: 1000,
            reservations: 50,
            ratings: 4.5
        }
    },
    // Add more restaurants as needed
};

app.use(bodyParser.json());

// API for Restaurant Manager Availability Management
app.post('/api/availability', (req, res) => {
    const { restaurant_id, date, time_slots } = req.body;
    
    // Update availability data in the database
    availabilityData[restaurant_id] = { date, time_slots };
    
    res.json({ message: 'Availability updated successfully' });
});

// API for Restaurant Owner Data Access
app.get('/api/restaurants/:restaurant_id/data', (req, res) => {
    const { restaurant_id } = req.params;
    
    // Retrieve data related to the specified restaurant from the database
    const data = restaurantData[restaurant_id];
    
    if (!data) {
        return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    res.json({ data });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
