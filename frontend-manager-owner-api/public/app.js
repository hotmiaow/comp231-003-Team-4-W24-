import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [restaurantId, setRestaurantId] = useState('');
  const [availabilityData, setAvailabilityData] = useState(null);
  const [ownerData, setOwnerData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleAvailabilitySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/availability', {
        restaurant_id: restaurantId,
        date: '2024-03-10', // Example date, replace with form input
        time_slots: ['18:00', '19:00'] // Example time slots, replace with form input
      });
      setAvailabilityData(response.data);
      setErrorMessage('');
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred while updating availability.');
    }
  };

  const handleOwnerAccessSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`/api/restaurants/${restaurantId}/data`);
      setOwnerData(response.data);
      setErrorMessage('');
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred while fetching restaurant data.');
    }
  };

  return (
    <div className="App">
      <h1>Restaurant Manager Availability Management</h1>
      <form onSubmit={handleAvailabilitySubmit}>
        <label htmlFor="managerRestaurantId">Restaurant ID:</label>
        <input 
          type="text" 
          id="managerRestaurantId" 
          value={restaurantId}
          onChange={(e) => setRestaurantId(e.target.value)}
          required
        /><br/><br/>
        {/* Add more form fields for date and time slots here */}
        <button type="submit">Submit</button>
      </form>

      <h1>Restaurant Owner Data Access</h1>
      <form onSubmit={handleOwnerAccessSubmit}>
        <label htmlFor="ownerRestaurantId">Restaurant ID:</label>
        <input 
          type="text" 
          id="ownerRestaurantId" 
          value={restaurantId}
          onChange={(e) => setRestaurantId(e.target.value)}
          required
        /><br/><br/>
        <button type="submit">View Data</button>
      </form>

      {errorMessage && <p className="error">{errorMessage}</p>}

      {/* Display availability data */}
      {availabilityData && (
        <div>
          <h2>Availability Data</h2>
          {/* Display availability data here */}
        </div>
      )}

      {/* Display owner data */}
      {ownerData && (
        <div>
          <h2>Owner Data</h2>
          {/* Display owner data here */}
        </div>
      )}
    </div>
  );
}

export default App;
