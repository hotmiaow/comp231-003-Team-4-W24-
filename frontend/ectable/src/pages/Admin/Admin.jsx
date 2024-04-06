// import React from "react";
import { Typography } from "@material-ui/core";

// import { useState } from "react";

import { useNavigate } from "react-router";

import { UseAuth } from "../../components/Auth/auth";

const Admin = () => {

  const {userIDs, restIDs} = UseAuth();
  const navigate = useNavigate();

  return (
    <div className="flex flex-row flex-wrap justify-center items-center mx-auto container gap-x-4 py-4">
  <Typography variant="h6" className="w-full text-center mb-4">
    Admin Page
  </Typography>
  <button
    className="bg-blue-500 text-white px-4 py-2 rounded"
    onClick={() => navigate(`/restManagement/${userIDs}`)}
  >
    Restaurant Reservation Management
  </button>
  <button
    className="bg-blue-500 text-white px-4 py-2 rounded"
    onClick={() => navigate(`/RestaurantSignup/${userIDs}`)}
  >
    Restaurant Signup
  </button>
  <button
    className="bg-blue-500 text-white px-4 py-2 rounded"
    onClick={() => navigate(`/MyRestaurants/${userIDs}`)}
  >
    My Restaurants
  </button>
  <button
    className="bg-blue-500 text-white px-4 py-2 rounded"
    onClick={() => navigate(`/Restaurant/availability/${restIDs}`)}
  >
    Restaurant Availability Management
  </button>
</div>

  );
};

export default Admin;
