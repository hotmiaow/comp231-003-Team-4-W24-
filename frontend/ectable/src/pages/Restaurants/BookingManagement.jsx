import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { readUserId, remove, update } from "../api-Reservation";
import {readEmail} from "../api-user";
import {emailUpdateConfirm, emailCancelConfirm} from "../api-EmailConfirmation";
import {UseAuth} from "../../components/Auth/auth";

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
  TextField,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";


const token = Cookies.get("accessToken");
function BookingManagement() {
  const {isLoggedIn} = UseAuth();
  const [reservations, setReservations] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    useEffect(() => {
      if(isLoggedIn){
          fetchReservations();
      }
    }, [isLoggedIn]);

    const controller = new AbortController();
    const signal = controller.signal;
    const credentials = {
      t: Cookies.get("accessToken")
    };

      const fetchReservations = async () => {
        const userId = Cookies.get("userId");
        console.log(userId);
        
        if (!userId) return;
        const data = await readUserId({ userId }, credentials, signal);
        console.log(data)

      try {
          const emailInfos = await Promise.all(data.map(async item => {
            if (item.dinerId) {
              const emailInfo = await readEmail(item);
              return { ...item, dinerEmail: emailInfo.email }; 
            } else {
              console.log('Missing dinerId for item:', item);
              return item; 
            }
          }));

          console.log(emailInfos);
          setReservations(emailInfos);

        } catch (e) {
          console.log(`Error fetching reservation emails: ${e}`);
        }
      };

      const handleDelete = async (reservation) => {

      setSelectedReservation(reservation);
      console.log(reservation._id)
      const params = {userId : reservation._id};
      console.log(params.userId);
      const credentials = {t:token};
      console.log(credentials)

      const email = {
        restaurant: reservation.restaurantName,
        date : reservation.date,
        time : reservation.time,
        people : reservation.people,
        userEmail : reservation.dinerEmail
      }
      
      remove(params, credentials).then(()=>{
        console.log('Reservation canceled');
        emailCancelSend(email);
        setShowDeleteDialog(true);
      })
      
    };

      const handleEdit = (reservation) => {
        console.log(reservation)
      
        setSelectedReservation(reservation);
        console.log(reservation.dinerEmail)
        setOpen(true);
    };

      const handleDeleteClose = async () =>{
        handleClose();
      }

      const handleClose = () => {
        setShowDeleteDialog(false);
        setShowSuccessDialog(false);
        setSelectedReservation('');
        setOpen(false);
        fetchReservations();
      };

    const handleCloseSuccessDialog = () =>{
      handleClose();
    }

    const handleSave = async (reservation) => {
      console.log(selectedReservation.date);
      console.log(selectedReservation.time);
      console.log(selectedReservation.people);
      console.log(selectedReservation._id);
      console.log(selectedReservation.dinerEmail)
     
      const updatedReservation = {
        date : selectedReservation.date,
        time : selectedReservation.time,
        people : selectedReservation.people
      };

      const email = {
        restaurant: selectedReservation.restaurantName,
        date : selectedReservation.date,
        time : selectedReservation.time,
        people : selectedReservation.people,
        userEmail : selectedReservation.dinerEmail
      }

      const credentials = {t:token};

      console.log(credentials.t)

      const params = {userId : selectedReservation._id};

      console.log(params.userId);

      try{
        const response = await update(params, credentials, updatedReservation);

        console.log(response)

        if(response.error){
          console.log(response.error)
        }
        else{
          console.log('update successful', response)
          emailUpdateSend(email);
          setShowSuccessDialog(true);
          await fetchReservations();
        }
      }
      catch (e){
        console.log('update failed', e.errorMessage)
        setShowSuccessDialog(false);
      }
    };

  const handleChange = (name, value) => {
    setSelectedReservation({ ...selectedReservation, [name]: value });
  };

    const emailUpdateSend = async (Email) => {
    
      emailUpdateConfirm(Email)
      .then((data) => {
        console.log(Email);
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });

      console.log(selectedReservation.dinerEmail)
  };

  const emailCancelSend = async(deleteData) =>{
      
    await emailCancelConfirm(deleteData)
      .then((data) => {
        console.log(deleteData);
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
      console.log(selectedReservation.dinerEmail)
      console.log(deleteData.dinerEmail)
  }

  return (
    <div>
      <h1>My Reservations</h1>
      {reservations.length >0 ? (
         
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Reservation id</TableCell>
                <TableCell>Restaurant Name</TableCell>
                <TableCell>Diner Email</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>People</TableCell>
                <TableCell>Selected Menu</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations &&
                reservations.map((reservation, index) => (
                  <TableRow key={index}>
                    <TableCell>{reservation._id}</TableCell>
                    <TableCell>{reservation.restaurantName}</TableCell>
                    <TableCell>{reservation.dinerEmail}</TableCell>
                    <TableCell>{reservation.date}</TableCell>
                    <TableCell>{reservation.time}</TableCell>
                    <TableCell>{reservation.people}</TableCell>
                    <TableCell>
                      {reservation.menuSelection && reservation.menuSelection.length > 0
                        ? reservation.menuSelection.join(", ")
                        : "No menu selected"}
                    </TableCell>
                    
                    <TableCell>
                      <IconButton
                        onClick={() => handleEdit(reservation)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(reservation)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      ): (
          <p>No bookings available</p>
        )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Booking</DialogTitle>
            <DialogContent>
              <TextField
                label="Date"
                value={selectedReservation ? selectedReservation.date : ""}
                onChange={(e) => handleChange("date", e.target.value)}
              />
              <TextField
                label="Time"
                value={selectedReservation ? selectedReservation.time : ""}
                onChange={(e) => handleChange("time", e.target.value)}
              />
              <TextField
                label="People"
                value={selectedReservation ? selectedReservation.people : ""}
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
                  The booking has been successfully updated.
                  </DialogContent>
                  <DialogContent>
                  Updated booking email confirmation has been sent to your email
                  </DialogContent>
                   <DialogContent>
                   {selectedReservation && <p>{selectedReservation.dinerEmail}</p>}
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseSuccessDialog}>OK</Button>
                </DialogActions>
                </Dialog>
                <Dialog open={showDeleteDialog} onClose={handleDeleteClose}>
                <DialogTitle>Cancel Booking</DialogTitle>
                <DialogContent>
                  The booking has been successfully cancelled.
                </DialogContent>
                <DialogContent>
                  Booking cancellation email confirmation has been sent to your email    
                  </DialogContent>
                <DialogContent>
                  {selectedReservation && <p>{selectedReservation.dinerEmail}</p>}
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleDeleteClose}>OK</Button>
                </DialogActions>
                </Dialog> 
    </div>
  );
}
export default BookingManagement;
