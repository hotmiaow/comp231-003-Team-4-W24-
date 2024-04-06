const express = require("express");

const restaurantRoutes = express.Router();

const dbo = require("../db/conn");

const ObjectId = require("mongodb").ObjectId;

const {
  getAllRestaurants,
  getRestaurantById,
  registerRestaurant,
  restaurantUpdateById,
  restaurantDeleteById,
  getRestaurantIdByChefId,
  myRestaurant
} = require("../Controller/restaurantController");

restaurantRoutes.get("/api/restaurants", getAllRestaurants);
restaurantRoutes.get("/api/restaurants/:id", getRestaurantById);
restaurantRoutes.post("/api/restaurants/register", registerRestaurant);
restaurantRoutes.post("/api/restaurants/:id/update", restaurantUpdateById);
restaurantRoutes.delete("/api/restaurants/:id/delete", restaurantDeleteById);
restaurantRoutes.post("/api/restaurants/chef", getRestaurantIdByChefId);
restaurantRoutes.get("/api/MyRestaurants", myRestaurant);

module.exports = restaurantRoutes;
