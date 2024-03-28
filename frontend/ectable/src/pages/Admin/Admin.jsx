import React from "react";
import { Button, Typography, Box } from "@material-ui/core";

const Admin = () => {
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
        onClick={() => (window.location.href = "/restManagement")}
        style={{ maxWidth: "500px", alignSelf: "center" }}
      >
        1. Go to Restaurant Management
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => (window.location.href = "/RestaurantSignup")}
        style={{ maxWidth: "500px", alignSelf: "center" }}
      >
        2. Go to Restaurant Signup
      </Button>
    </Box>
  );
};

export default Admin;
