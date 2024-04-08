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
  DialogContent,
  Card,
  CardMedia,
  CardContent,
} from "@material-ui/core";
import { useParams } from "react-router-dom";

import { create } from "./api-Reservation";

import emailConfirm from "./api-EmailConfirmation";

import { read } from "./Restaurants/api-restaurant";
import Cookies from "js-cookie";

const BookingPage = () => {
  const { restaurantId } = useParams();
  const [openDialog, setOpenDialog] = useState(false);
  const [FullDialog, setFullDialog] = useState(false);
  const [dialogImage, setDialogImage] = useState("");

  const [bookingDetails, setBookingDetails] = useState({
    date: "",
    time: "",
    people: "",
    menuSelection: [],
  });

  // const [emailInfor, setEmailInfor] = useState({
  //   date : "",
  //   time : "", 
  //   people : "",
  //   restaurant : "",
  //   userEmail : ""
  // })



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
    console.log(credentials.t);
    console.log(restaurantId);
    const restaurantData = await read({_id : restaurantId}, credentials, signal);
    console.log(restaurantData.name);
    console.log(Cookies.get("userEmail"))


    const Reservation = {
      restaurantId: restaurantId,
      restaurantName: restaurantData.name,
      date: bookingDetails.date || undefined,
      time: bookingDetails.time || undefined,
      people: bookingDetails.people || undefined,
      menuSelection: bookingDetails.menuSelection || undefined,
      dinerId: Cookies.get("userId") || undefined,
      dinerName: Cookies.get("dinerName"),
      dinerEmail : Cookies.get("userEmail")
    };

    const Email = {
        date: bookingDetails.date || undefined,
        time: bookingDetails.time || undefined,
        people: bookingDetails.people || undefined,
        restaurant : restaurantData.name || undefined,
        userEmail : Cookies.get("userEmail")
    }

    console.log(Reservation)

    create(Reservation).then((data) => {
      console.log(data.success);
      console.log(data);
      console.log(data.data.remain);
      console.log(data.data.total);
      
      if (data.data.success) {
        setOpenDialog(true);
        setFullDialog(false)
        emailSend(Email);
      } else {
        setBookingDetails({ ...bookingDetails, error: data.error, remain : data.data.remain });
        setOpenDialog(false);
        setFullDialog(true);
      }
    }); // Add logic here to send booking details to your backend
  };

  

  const emailSend = async (Email) =>{
    emailConfirm(Email).then((data)=>{
      console.log(Email);
      console.log(data);
    }).catch((err) =>{
      console.log(err);
    })
  }

  const handleClose = () => {
    setOpenDialog(false);
    // Additional logic to redirect the user or reset the form
  };

  const handleFullClose = () =>{
    setFullDialog(false);
  }

  const handleDialogOpen = (image) => {
    setDialogImage(image);
    setOpenDialog(true);
  };

  const menuItems = [
    { 
      name: "Steak", 
      price: 20, 
      image: "../../images/steak.jpg", 
      description: "Juicy beef steak cooked to perfection, served with a side of vegetables and mashed potatoes." 
    },
    { 
      name: "Salmon", 
      price: 18, 
      image: "../../images/salmon.jpg", 
      description: "Fresh Atlantic salmon fillet grilled and seasoned with herbs, served with steamed rice and lemon wedges." 
    },
    { 
      name: "Burger", 
      price: 15, 
      image: "../../images/burger.jpg", 
      description: "Classic beef burger with lettuce, tomato, onion, pickles, and your choice of cheese, served with fries." 
    },
    { 
      name: "Pizza", 
      price: 23, 
      image: "../../images/pizza.jpg", 
      description: "Hand-tossed pizza with your choice of toppings, baked to perfection in a wood-fired oven." 
    },
    { 
      name: "Pancake", 
      price: 12, 
      image: "../../images/pancake.jpg", 
      description: "Fluffy pancakes served with maple syrup, whipped cream, and a side of fresh fruits." 
    },
    { 
      name: "Croissant", 
      price: 10, 
      image: "../../images/croissant.jpg", 
      description: "Buttery and flaky croissant, perfect for breakfast or as a light snack." 
    },
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
        <DialogContent>
            You have reserved a table on {bookingDetails.date} at {bookingDetails.time} successfully. 
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
          {/* <DialogContent>
            {bookingDetails.date} at {bookingDetails.time}
          </DialogContent> */}
          <DialogContent>
          Currently, only {bookingDetails.remain} are available for booking on {bookingDetails.date} at {bookingDetails.time}.
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

      <FormControl component="fieldset">
        <Typography variant="h6">Select Menu Items</Typography>
        {menuItems.map((item) => (
          <Card key={item.name} style={{ display: 'flex', marginBottom: '10px' }}>
            <CardContent style={{ flex: 1 }}>
              <FormControlLabel
                control={<Checkbox onChange={handleMenuChange} name={item.name} />}
                label={`${item.name} - $${item.price}`}
              />
              <Typography>{item.description}</Typography>
            </CardContent>
            <CardMedia
              style={{ width: '100px' }}
              image={item.image}
              title={item.name}
              onClick={() => handleDialogOpen(item.image)}
            />
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button onClick={() => handleDialogOpen(item.image)} color="primary">View Image</Button>
            </div>
          </Card>
        ))}
      </FormControl>

      <Dialog open={openDialog} onClose={handleClose} maxWidth="md">
        <DialogTitle>Image</DialogTitle>
        <DialogContent>
          <img src={dialogImage} alt="Menu Item" style={{ width: '100%' }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BookingPage;
