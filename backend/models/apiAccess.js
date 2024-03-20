import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [reservationId, setReservationId] = useState('');
  const [reservationData, setReservationData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCreateReservation = async () => {
    try {
      const response = await axios.post('/api/reservation/register', {
        //  Provide data for creating reservation here
      });
      console.log(response.data); // Log response from backend
      setErrorMessage('');
    } catch (error) {
      console.error(error);
      setErrorMessage('Error creating reservation');
    }
  };

  const handleListReservations = async () => {
    try {
      const response = await axios.get('/api/reservation');
      console.log(response.data); // Log response from backend
      setErrorMessage('');
    } catch (error) {
      console.error(error);
      setErrorMessage('Error listing reservations');
    }
  };

  const handleReadReservation = async () => {
    try {
      const response = await axios.get(`/api/reservation/${reservationId}`);
      console.log(response.data); // Log response from backend
      setReservationData(response.data);
      setErrorMessage('');
    } catch (error) {
      console.error(error);
      setReservationData(null);
      setErrorMessage('Error reading reservation');
    }
  };

  const handleUpdateReservation = async () => {
    try {
      const response = await axios.put(`/api/reservation/${reservationId}`, {
        // Provide updated data for reservation here
      });
      console.log(response.data); // Log response from backend
      setErrorMessage('');
    } catch (error) {
      console.error(error);
      setErrorMessage('Error updating reservation');
    }
  };

  const handleDeleteReservation = async () => {
    try {
      const response = await axios.delete(`/api/reservation/${reservationId}`);
      console.log(response.data); // Log response from backend
      setErrorMessage('');
    } catch (error) {
      console.error(error);
      setErrorMessage('Error deleting reservation');
    }
  };

  return (
    <div className="App">
      <h1>Reservation Management</h1>
      <button onClick={handleCreateReservation}>Create Reservation</button>
      <button onClick={handleListReservations}>List Reservations</button>
      <input
        type="text"
        placeholder="Reservation ID"
        value={reservationId}
        onChange={(e) => setReservationId(e.target.value)}
      />
      <button onClick={handleReadReservation}>Read Reservation</button>
      <button onClick={handleUpdateReservation}>Update Reservation</button>
      <button onClick={handleDeleteReservation}>Delete Reservation</button>
      {errorMessage && <p className="error">{errorMessage}</p>}
      {reservationData && (
        <div>
          <h2>Reservation Data</h2>
          <pre>{JSON.stringify(reservationData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
