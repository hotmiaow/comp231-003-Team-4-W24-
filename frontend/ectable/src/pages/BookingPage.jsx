import { useState, useEffect } from "react";
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
  DialogContent,
} from "@material-ui/core";
import { useParams } from "react-router-dom";
import { create } from "./api-Reservation";
import {emailCreateConfirm} from "./api-EmailConfirmation";
import { read } from "./Restaurants/api-restaurant";
import { fetchMenuForRestaurant } from "./Chef/api-MenuMnagement";
import Cookies from "js-cookie";

const BookingPage = () => {
  const { restaurantId } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [FullDialog, setFullDialog] = useState(false);
  const [restName, setRestName] = useState('');
  const [bookingDetails, setBookingDetails] = useState({
    date: "",
    time: "",
    people: "",
    menuSelection: [],
  });

   const controller = new AbortController();
    const signal = controller.signal;

  const fetchRestName = async () =>{
      try{
         
          const credentials = {
            t: Cookies.get("accessToken"),
          };
          const id = {_id: restaurantId};

          const response = await read(id, credentials, signal );
          console.log(response);

          setRestName(response.name);
          
      }catch(e){
        console.log(`error to fetch restaurant name  ${e}`);
      }
    }

  useEffect(() => {
    if(restaurantId){
      fetchRestName();
    }

    const fetchMenu = async () => {
      try {
        const credentials = {
          t: Cookies.get("accessToken"),
        };
        const menuData = await fetchMenuForRestaurant(
          { restaurantId: restaurantId },
          credentials
        );
        setMenuItems(menuData);

      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    fetchMenu();

    return () => controller.abort();
  }, [restaurantId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails({ ...bookingDetails, [name]: value });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const credentials = {
      t: Cookies.get("accessToken"),
    };
    const restaurantData = await read({ _id: restaurantId }, credentials);
    
    const Reservation = {
      restaurantId: restaurantId,
      restaurantName: restaurantData.name,
      date: bookingDetails.date || undefined,
      time: bookingDetails.time || undefined,
      people: bookingDetails.people || undefined,
      menuSelection: bookingDetails.menuSelection || undefined,
      dinerId: Cookies.get("userId") || undefined,
      dinerName: Cookies.get("dinerName"),
      dinerEmail: Cookies.get("userEmail"),
    };
    const Email = {
      date: bookingDetails.date || undefined,
      time: bookingDetails.time || undefined,
      people: bookingDetails.people || undefined,
      restaurant: restaurantData.name || undefined,
      userEmail: Cookies.get("userEmail"),
    };

    create(Reservation).then((data) => {
      if (data.data.success) {
        setOpenDialog(true);
        setFullDialog(false);
        emailSend(Email);
        
      } else {
        setBookingDetails({
          ...bookingDetails,
          error: data.error,
          remain: data.data.remain,
        });
        setOpenDialog(false);
        setFullDialog(true);
      }
    });
  };

  const emailSend = async (Email) => {
    emailCreateConfirm(Email)
      .then((data) => {
        console.log(Email);
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleClose = () => {
    setOpenDialog(false);
    setBookingDetails({
          date: "",
          time: "",
          people: "",
          menuSelection: [],
        });
    
  };

  const handleFullClose = () => {
    setFullDialog(false);
    setBookingDetails({
          date: "",
          time: "",
          people: "",
          menuSelection: [],
        });
    
  };

  const handleMenuChange = (event) => {
    const { name, checked } = event.target;
    const selectedItemId = menuItems.find((item) => item.name === name)?._id;

    setBookingDetails((prevBookingDetails) => ({
      ...prevBookingDetails,
      menuSelection: checked
        ? [...prevBookingDetails.menuSelection, selectedItemId]
        : prevBookingDetails.menuSelection.filter(
            (id) => id !== selectedItemId
          ),
    }));
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
        <Button type="submit" color="primary" variant="contained">
          Book Now
        </Button>
      </form>
      <FormControl component="fieldset">
        <Typography variant="h6">Select Menu Items</Typography>
        {menuItems.map((item) => (
          <FormControlLabel
            key={item._id}
            control={
              <Checkbox
                onChange={handleMenuChange}
                name={item.name}
                checked={bookingDetails.menuSelection.includes(item._id)}
              />
            }
            label={`${item.name} - $${item.price}`}
          />
        ))}
      </FormControl>
      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>Booking Successful</DialogTitle>
        <DialogContent>
          You have reserved a table on {bookingDetails.date} at{" "}
          {bookingDetails.time} at {restName} successfully.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={FullDialog} onClose={handleFullClose}>
        <DialogTitle>Booking Failed</DialogTitle>
        <DialogContent>
          Insufficient availability for your selected date and time in below.
        </DialogContent>
        <DialogContent>
          Currently, only {bookingDetails.remain} are available for booking on{" "}
          {bookingDetails.date} at {bookingDetails.time}.
        </DialogContent>
        <DialogContent>
          Please select an alternative date or time slot for your reservation.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFullClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BookingPage;
