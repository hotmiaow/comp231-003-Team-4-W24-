import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { update, remove } from "../api-Reservation.js";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@material-ui/core";

import { fetchReadonlyReservations } from "./api-ROManagement";

const token = Cookies.get("accessToken");
const RestManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const controller = new AbortController();
  const signal = controller.signal;
  const credentials = {
    t: Cookies.get("accessToken"), // Example: Retrieving an auth token from cookies
  };

  // Fetch reservations when component mounts

  const fetchBookings = async () => {
    // Use userId from cookie as AdminId
    const readonlyId = Cookies.get("userId");
    console.log(readonlyId);

    if (!readonlyId) return;
    const data = await fetchReadonlyReservations(
      { readonlyId: readonlyId },
      credentials,
      signal
    );
    if (data && !data.error) {
      setBookings(data);
    }
  };

  const handleDelete = async (booking) => {
    // Implement remove method
    setSelectedBooking(booking);
    console.log(booking._id);
    const params = { userId: booking._id };
    console.log(params.userId);
    const credentials = { t: token };
    console.log(credentials);

    remove(params, credentials).then(() => {
      console.log("Reservation canceled");
      setShowDeleteDialog(true);
    });

    // Show the dialog here after confirmation of deletion

    // Consider postponing page reload or fetching updated data instead to reflect changes
  };

  // Helper function to get cookie value
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  return (
    <>
      {bookings.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Reservation id</TableCell>
                <TableCell>Restaurant Name</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>People</TableCell>
                <TableCell>Selected Menu</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking._id}>
                  <TableCell>{booking._id}</TableCell>
                  <TableCell>{booking.restaurantName}</TableCell>
                  <TableCell>{booking.date}</TableCell>
                  <TableCell>{booking.time}</TableCell>
                  <TableCell>{booking.people}</TableCell>
                  <TableCell>
                    {booking.menuSelection && booking.menuSelection.length > 0
                      ? booking.menuSelection.join(", ")
                      : "No menu selected"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <p>No bookings available</p>
      )}
    </>
  );
};

export default RestManagement;
