import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { readUserId } from "../api-Reservation";

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
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import EmailIcon from "@material-ui/icons/Email";
import IconButton from "@material-ui/core/IconButton";
function BookingManagement() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const credentials = {
      t: Cookies.get("accessToken"), // Example: Retrieving an auth token from cookies
    };

    const fetchReservations = async () => {
      const userId = Cookies.get("userId");
      if (!userId) return;
      const data = await readUserId({ userId }, credentials, signal);
      console.log(data)
      setReservations(data);
      setLoading(false);
    };

    fetchReservations();
  }, []);

  const handleDialogOpen = (type, reservation) => {
    setSelectedReservation(reservation);
    setDialogType(type);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedReservation(null);
  };

  const handleUpdate = () => {
    // Placeholder for update logic
    console.log("Updating:", selectedReservation);
    handleDialogClose();
  };

  const handleRemove = () => {
    // Placeholder for remove logic
    console.log("Removing:", selectedReservation);
    handleDialogClose();
  };

  const handleEmail = (reservation) => {
    const emailSubject = encodeURIComponent(
      `Reservation at ${reservation.restaurantName}`
    );
    const emailBody = encodeURIComponent(
      `I have a reservation on ${reservation.date} at ${reservation.time} for ${reservation.people} people.`
    );
    window.location.href = `mailto:?subject=${emailSubject}&body=${emailBody}`;
  };

  return (
    <div>
      <h1>My Reservations</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>People</TableCell>
                <TableCell>Restaurant Name</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations &&
                reservations.map((reservation, index) => (
                  <TableRow key={index}>
                    <TableCell>{reservation.date}</TableCell>
                    <TableCell>{reservation.time}</TableCell>
                    <TableCell>{reservation.people}</TableCell>
                    <TableCell>{reservation.restaurantName}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleDialogOpen("update", reservation)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDialogOpen("remove", reservation)}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton onClick={() => handleEmail(reservation)}>
                        <EmailIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>
          {dialogType === "update" ? "Update Reservation" : "Confirm Removal"}
        </DialogTitle>
        <DialogContent>
          {dialogType === "update" ? (
            <TextField
              autoFocus
              margin="dense"
              label="People"
              type="number"
              fullWidth
              variant="outlined"
            />
          ) : (
            "Are you sure you want to remove this reservation?"
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          {dialogType === "update" ? (
            <Button onClick={handleUpdate} color="primary">
              Update
            </Button>
          ) : (
            <Button onClick={handleRemove} color="primary">
              Remove
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default BookingManagement;
