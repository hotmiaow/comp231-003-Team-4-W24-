import React, { useState } from "react";
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
import { create } from "./api-user";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@material-ui/core";

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
}));

// const create = async (user) => {
//   return { error: null }; // Simulated API call
// };

export default function Signup() {
  const classes = useStyles();

  const [values, setValues] = useState({
    name: "",
    password: "",
    email: "",
    phone: "",
    type: "Diner", // Default value
  });

  const [open, setOpen] = useState(false);

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const clickSubmit = () => {
    const user = {
      name: values.name || undefined,
      email: values.email || undefined,
      password: values.password || undefined,
      phone: values.phone || undefined,
      type: values.type || "Diner",
    };

    create(user).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setOpen(true);
      }
    });
  };

  Signup.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
  };

  const handleRoleChange = (event) => {
    setValues({ ...values, type: event.target.value });
  };

  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6" className={classes.title}>
            Sign Up
          </Typography>

          <TextField
            id="name"
            label="Name"
            className={classes.textField}
            value={values.name}
            onChange={handleChange("name")}
            margin="normal"
          />
          <TextField
            id="email"
            label="Email"
            className={classes.textField}
            value={values.email}
            onChange={handleChange("email")}
            margin="normal"
          />
          <TextField
            id="phone"
            label="Phone"
            className={classes.textField}
            value={values.phone}
            onChange={handleChange("phone")}
            margin="normal"
          />
          <TextField
            id="password"
            label="Password"
            className={classes.textField}
            value={values.password}
            onChange={handleChange("password")}
            type="password"
            margin="normal"
          />
          <FormControl component="fieldset">
            <RadioGroup
              row
              aria-label="role"
              name="role"
              value={values.type}
              onChange={handleRoleChange}
            >
              <FormControlLabel
                value="Diner"
                control={<Radio color="primary" />}
                label="Diner"
              />
              <FormControlLabel
                value="Admin"
                control={<Radio color="primary" />}
                label="Restaurant Admin"
              />
            </RadioGroup>
          </FormControl>
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
        <DialogTitle>New Registration</DialogTitle>
        <DialogContent>
          {values.type === "Diner" ? (
            <DialogContentText>
              Congratulations on successfully creating your diner account!
            </DialogContentText>
          ) : (
            <DialogContentText>
              Your restaurant admin account has been created successfully.
              Welcome to our community!
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Link to="/Login">
            <Button
              color="primary"
              autoFocus
              variant="contained"
              onClick={handleClose}
            >
              Login
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    </div>
  );
}
