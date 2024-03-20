// eslint-disable-next-line no-unused-vars

import { useState } from "react";
import {
  FormControl,
  FormControlLabel,
  Checkbox,
  TextField,
  Button,
  MenuItem,
  Typography,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@material-ui/core";
import { useParams } from "react-router-dom";

import { create } from "./api-Reservation";
import Cookies from "js-cookie";
import { read } from "./Restaurants/api-restaurant";

const BookingPage = () => {
  const { restaurantId, dinerId } = useParams();
  const [openDialog, setOpenDialog] = useState(false);

  const [bookingDetails, setBookingDetails] = useState({
    date: "",
    time: "",
    people: "",
    menuSelection: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails({ ...bookingDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const controller = new AbortController();
    const signal = controller.signal;
    const credentials = {
      t: Cookies.get("accessToken"), // Example: Retrieving an auth token from cookies
    };
    console.log(restaurantId);
    const restaurantData = await read({_id : restaurantId}, credentials, signal);
    console.log(restaurantData.name);

    const Reservation = {
      restaurantId: restaurantId,
      restaurantName: restaurantData.name,
      date: bookingDetails.date || undefined,
      time: bookingDetails.time || undefined,
      people: bookingDetails.people || undefined,
      menuSelection: bookingDetails.menuSelection || undefined,
      dinerId: Cookies.get("userId") || undefined,
      dinerName: Cookies.get("dinerName"),
      dinerEmail : Cookies.get("dinerEmail")
    };

    create(Reservation).then((data) => {
      if (data.error) {
        setBookingDetails({ ...bookingDetails, error: data.error });
        setOpenDialog(false);
      } else {
        setOpenDialog(true);
      }
    }); // Add logic here to send booking details to your backend
  };

  const handleClose = () => {
    setOpenDialog(false);
    // Additional logic to redirect the user or reset the form
  };

  const menuItems = [
    { name: "Steak", price: 20 },
    { name: "Salmon", price: 18 },
    // Add more menu items
  ];

  // Inside the BookingPage component, add a state to manage selected menu items
  const [selectedMenu, setSelectedMenu] = useState([]);

  const handleMenuChange = (event) => {
  const { name, checked } = event.target;
  setSelectedMenu((prevSelectedMenu) => {
    // Determine the new selection based on whether the checkbox was checked or unchecked
    const newMenuSelection = checked
      ? [...prevSelectedMenu, name]
      : prevSelectedMenu.filter((item) => item !== name);

    // Now correctly update the bookingDetails with the new menu selection
    setBookingDetails((prevBookingDetails) => ({
      ...prevBookingDetails,
      menuSelection: newMenuSelection,
    }));

    // Return the new menu selection to update the selectedMenu state
    return newMenuSelection;
  });
};

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Dinner Booking
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="date"
          type="date"
          name="date"
          value={bookingDetails.date}
          onChange={handleInputChange}
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          select
          label="time"
          name="time"
          value={bookingDetails.time}
          onChange={handleInputChange}
          helperText="Please select your booking time"
          required
        >
          {[
            "12:00",
            "13:00",
            "14:00",
            "15:00",
            "16:00",
            "17:00",
            "18:00",
            "19:00",
            "20:00",
            "21:00",
          ].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="people"
          type="number"
          name="people"
          value={bookingDetails.people}
          onChange={handleInputChange}
          required
        />
        {/* Menu selection will be added here */}
        <Button type="submit" color="primary" variant="contained">
          Book Now
        </Button>
      </form>
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>Booking Successful</DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <FormControl component="fieldset">
        <Typography variant="h6">Select Menu Items</Typography>
        {menuItems.map((item) => (
          <FormControlLabel
            control={<Checkbox onChange={handleMenuChange} name={item.name} />}
            label={`${item.name} - $${item.price}`}
            key={item.name}
          />
        ))}
      </FormControl>
    </div>
  );
};

export default BookingPage;
