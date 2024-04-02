import React, { useEffect, useState } from 'react';
import Cookies from "js-cookie";
import { fetchMyRestaurants } from './api-Restaurant';
import { Link } from 'react-router-dom';

import {
  Box,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@material-ui/core";

const MyRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const credentials = {
      t: 'Bearer ' + Cookies.get("accessToken"),
    };

    const fetchRestaurants = async () => {
      const userId = getCookie("userId");
      // console.log("getCookie: userId:")
      // console.log(getCookie("userId"))
      try {
        if (!userId) return;
        const data = await fetchMyRestaurants(credentials, signal);
        if (data && !data.error) {
            setRestaurants(data);
        }
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        setError('Error fetching restaurants');
      }
    };

    fetchRestaurants();

    // Abort the fetch on component unmount
    return () => controller.abort();
  }, []);

  // Helper function to get cookie value
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  return (
    <Container maxWidth="lg">
    <Box m={4}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Restaurants
      </Typography>
      {error && <div>{error}</div>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Location</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Description</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Opening</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Closing</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Phone</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell style={{ fontWeight: 'bold' }}>Edit Menu</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {restaurants.map((restaurant) => (
              <TableRow key={restaurant._id}>
                <TableCell>{restaurant.name}</TableCell>
                <TableCell>{restaurant.location}</TableCell>
                <TableCell>{restaurant.description}</TableCell>
                <TableCell>{restaurant.opening}</TableCell>
                <TableCell>{restaurant.closing}</TableCell>
                <TableCell>{restaurant.phone}</TableCell>
                <TableCell>{restaurant.email}</TableCell>
                <TableCell><Link to={`/edit-menu/${restaurant._id}`}>Edit Menu</Link></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
    </Container>
  );
};

export default MyRestaurants;
