// import React from "react";
import { Button, Typography, Box } from "@material-ui/core";

// import { useState } from "react";

import { useNavigate } from "react-router";

import { UseAuth } from "../../components/Auth/auth";

const Admin = () => {

  const {userIDs, restIDs} = UseAuth();
  const navigate = useNavigate();

  return (
    <Box
      style={{ padding: 20, display: "flex", flexDirection: "column", gap: 20 }}
    >
      <Typography variant="h6" gutterBottom>
        Admin Page
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate(`/restManagement/${userIDs}`)}
        style={{ maxWidth: "500px", alignSelf: "center" }}
      >
        Go to Restaurant Management
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate(`/RestaurantSignup/${userIDs}`)}
        style={{ maxWidth: "500px", alignSelf: "center" }}
      >
        Go to Restaurant Signup
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate(`/Restaurant/availability/${restIDs}`)}
        style={{ maxWidth: "500px", alignSelf: "center" }}
      >
        Restaurant Availability Management
      </Button>
    </Box>
  );
};

export default Admin;
