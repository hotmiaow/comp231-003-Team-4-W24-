import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { create } from "./api-Restaurant";
import { useParams } from "react-router-dom";
import image1 from "../../assets/images/image1.jpg";
import image2 from "../../assets/images/image2.jpg";
import image3 from "../../assets/images/image3.jpg";
import image4 from "../../assets/images/image4.jpg";
import image5 from "../../assets/images/image5.jpg";
import image6 from "../../assets/images/image6.jpg";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null; // Return null if cookie is not found
};

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 400,
    margin: "0 auto",
    marginTop: theme.spacing(3),
    padding: theme.spacing(2),
    textAlign: "center",
    backgroundColor: "#DDEBF7",
  },
  textField: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  error: {
    color: "red",
  },
  submit: {
    margin: "0 auto",
    marginBottom: theme.spacing(2),
  },
  title: {
    fontSize: 18,
  },
  selectedImageClass: {
    border: "5px solid #ff51b5", // Example border color, adjust as needed
    borderRadius: theme.shape.borderRadius, // Optional, for rounded corners
  },
}));

// const create = async (user) => {
//   return { error: null }; // Simulated API call
// };

export default function RestaurantSignup() {
  const { default_admin_email } = useParams();

  const classes = useStyles();

  const [values, setValues] = useState({
    name: "",
    location: "",
    rating: "",
    cuisine: "",
    price: "",
    description: "",
    closing: "",
    opening: "",
    phone: "",
    email: "",
    adminEmail: "",
    readonlyEmail: "",
    selectedImage: "",
  });

  useEffect(() => {
    const userID = getCookie("userId");
    if (userID) {
      fetch(`http://localhost:5500/User/${userID}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          if (data.email) {
            setValues((prevValues) => ({
              ...prevValues,
              adminEmail: data.email,
            }));
          }
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
    }
  }, []);

  const [open, setOpen] = useState(false);

  const handleChange = (name) => (event) => {
    if (name === "photo" && event.target.files) {
      // Store the file object in the state
      setValues({ ...values, [name]: event.target.files[0] });
    } else {
      setValues({ ...values, [name]: event.target.value });
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const clickSubmit = () => {
    const restaurant = {
      email: values.email || undefined,
      name: values.name || undefined,
      location: values.location || undefined,
      photo: values.photo || undefined,
      rating: values.rating || undefined,
      cuisine: values.cuisine || undefined,
      price: values.price || undefined,
      description: values.description || undefined,
      closing: values.closing || undefined,
      opening: values.opening || undefined,
      phone: values.phone || undefined,
      adminEmail: values.adminEmail || undefined,
      readonlyEmail: values.readonlyEmail || undefined,
      selectedImage: values.selectedImage || undefined,
    };

    create(restaurant).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setOpen(true);
      }
    });
  };

  const handleImageSelection = (imageName) => {
    setValues({ ...values, selectedImage: imageName });
  };

  RestaurantSignup.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func,
  };

  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6" className={classes.title}>
            Sign Up Restaurant
          </Typography>

          <TextField
            id="email"
            label="Owner name"
            className={classes.textField}
            value={values.email}
            onChange={handleChange("email")}
            margin="normal"
          />

          <TextField
            id="name"
            label="name"
            className={classes.textField}
            value={values.name}
            onChange={handleChange("name")}
            margin="normal"
          />
          <TextField
            id="location"
            label="location"
            className={classes.textField}
            value={values.location}
            onChange={handleChange("location")}
            margin="normal"
          />
          <TextField
            id="photo"
            label="photo"
            className={classes.textField}
            value={values.photo}
            onChange={handleChange("photo")}
            margin="normal"
          />
          <TextField
            id="cuisine"
            label="cuisine"
            className={classes.textField}
            value={values.cuisine}
            onChange={handleChange("cuisine")}
            margin="normal"
          />
          <TextField
            id="price"
            label="price"
            className={classes.textField}
            value={values.price}
            onChange={handleChange("price")}
            type="price"
            margin="normal"
          />
          <TextField
            id="description"
            label="description"
            className={classes.textField}
            value={values.description}
            onChange={handleChange("description")}
            type="description"
            margin="normal"
          />
          <TextField
            id="closing"
            label="closing"
            className={classes.textField}
            value={values.closing}
            onChange={handleChange("closing")}
            type="closing"
            margin="normal"
          />
          <TextField
            id="opening"
            label="opening"
            className={classes.textField}
            value={values.opening}
            onChange={handleChange("opening")}
            type="opening"
            margin="normal"
          />
          <TextField
            id="phone"
            label="phone"
            className={classes.textField}
            value={values.phone}
            onChange={handleChange("phone")}
            type="phone"
            margin="normal"
          />
          <TextField
            id="adminEmail"
            label="Admin Account Email"
            className={classes.textField}
            value={values.adminEmail}
            onChange={handleChange("adminEmail")}
            disabled
            margin="normal"
            defaultValue={default_admin_email}
          />
          <TextField
            id="readonlyEmail"
            label="Read Only Account Email"
            className={classes.textField}
            value={values.readonlyEmail}
            onChange={handleChange("readonlyEmail")}
            margin="normal"
          />
          <div>
            <Typography variant="h6" className={classes.title}>
              Choose an Image for Your Restaurant
            </Typography>
            <div>
              {[image1, image2, image3, image4, image5, image6].map(
                (image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Restaurant Image ${index + 1}`}
                    style={{
                      width: "200px",
                      margin: "10px",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      handleImageSelection(`image${index + 1}.jpg`)
                    }
                    className={
                      values.selectedImage === `image${index + 1}.jpg`
                        ? classes.selectedImageClass
                        : ""
                    }
                  />
                )
              )}
            </div>
          </div>
        </CardContent>
        <CardActions>
          <Button
            color="primary"
            variant="contained"
            onClick={clickSubmit}
            className={classes.submit}
          >
            Submit
          </Button>
        </CardActions>
      </Card>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>New Restaurant</DialogTitle>
        <DialogContent>
          <DialogContentText>
            New Restaurant successfully created.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Link to="/RestManagement">
            <Button
              color="primary"
              autoFocus
              variant="contained"
              onClick={handleClose}
            >
              Login In
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    </div>
  );
}
