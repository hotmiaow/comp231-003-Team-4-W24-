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

restaurantRoutes.get("/restaurants", getAllRestaurants);
restaurantRoutes.get("/restaurants/:id", getRestaurantById);
restaurantRoutes.post("/restaurants/register", registerRestaurant);
restaurantRoutes.post("/restaurants/:id/update", restaurantUpdateById);
restaurantRoutes.delete("/restaurants/:id/delete", restaurantDeleteById);
restaurantRoutes.post("/restaurants/chef", getRestaurantIdByChefId);
restaurantRoutes.get("/MyRestaurants", myRestaurant);

module.exports = restaurantRoutes;
