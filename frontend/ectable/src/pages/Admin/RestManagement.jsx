import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { update, remove } from "../api-Reservation.js";
// import { create } from "../api-User.js";

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

// import { UseAuth } from "../../components/Auth/auth.jsx";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";

import { fetchReservations } from "./api-RestManagement";

const token = Cookies.get("accessToken");
const RestManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
    const userId = Cookies.get("userId");
    console.log(userId);

    if (!userId) return;
    const data = await fetchReservations(
      { userId: userId },
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

  const handleEdit = (booking) => {
    setSelectedBooking(booking);
    setOpen(true);
  };

  const handleDeleteClose = async () => {
    setShowDeleteDialog(false);
    await fetchBookings();
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedBooking(null);
  };

  const handleCloseSuccessDialog = () => {
    setShowSuccessDialog(false);
    handleClose();
  };

  const handleSave = async (booking) => {
    // Implement update method
    console.log(selectedBooking.date);
    console.log(selectedBooking.time);
    console.log(selectedBooking.people);
    console.log(selectedBooking._id);

    const updatedBooking = {
      date: selectedBooking.date,
      time: selectedBooking.time,
      people: selectedBooking.people,
    };

    const credentials = { t: token };

    console.log(credentials.t);

    const params = { userId: selectedBooking._id };

    console.log(params.userId);

    try {
      const response = await update(params, credentials, updatedBooking);

      console.log(response);

      if (response.error) {
        console.log(response.error);
      } else {
        console.log("update successful", response);
        setShowSuccessDialog(true);
        await fetchBookings();
      }
    } catch (e) {
      console.log("update failed", e.errorMessage);
      setShowSuccessDialog(false);
    }
  };

  const handleChange = (name, value) => {
    // Update selected booking state with new value
    setSelectedBooking({ ...selectedBooking, [name]: value });
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
                <TableCell>Actions</TableCell>
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
                  <TableCell>
                    <IconButton onClick={() => handleEdit(booking)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(booking)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <p>No bookings available</p>
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Booking</DialogTitle>
        <DialogContent>
          <TextField
            label="Date"
            value={selectedBooking ? selectedBooking.date : ""}
            onChange={(e) => handleChange("date", e.target.value)}
          />
          <TextField
            label="Time"
            value={selectedBooking ? selectedBooking.time : ""}
            onChange={(e) => handleChange("time", e.target.value)}
          />
          <TextField
            label="People"
            value={selectedBooking ? selectedBooking.people : ""}
            onChange={(e) => handleChange("people", e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showSuccessDialog} onClose={handleCloseSuccessDialog}>
        <DialogTitle>Edit Booking</DialogTitle>
        <DialogContent>
          <p>The booking has been successfully updated.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSuccessDialog}>OK</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showDeleteDialog} onClose={handleDeleteClose}>
        <DialogTitle>Edit Booking</DialogTitle>
        <DialogContent>
          <p>The booking has been successfully cancelled.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose}>OK</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RestManagement;
