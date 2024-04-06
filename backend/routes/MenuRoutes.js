const express = require("express");

const MenuRoutes = express.Router();

const dbo = require("../db/conn");

const ObjectId = require("mongodb").ObjectId;

const authToken = require("../Auth/token");

const {
  updateRestaurantAvailability,
} = require("../Controller/restaurantController");
const { TopologyDescription } = require("mongodb");

MenuRoutes.route("/Menu").get(async function (req, response) {
  let db_connect = dbo.getDb();

  try {
    var records = await db_connect.collection("Menu").find({}).toArray();
    response.json(records);
  } catch (e) {
    console.log("An error occurred pulling the records. " + e);
  }
});

MenuRoutes.route("/Menu/register").post(async (req, res) => {
    const db_connect = dbo.getDb("Menu");
    console.log(req.body.restaurantId);
    
    const menu = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      restaurantId: req.body.restaurantId
    };
    console.log(menu)

    try {
      var records = await db_connect.collection("Menu").insertOne(menu)
                    .then((result) => {
                      res.json(result);
                      console.log(result);
                    })
                    .catch((err) => console.log(err));
    } catch (e) {
      console.log("An error occurred pulling the records. " + e);
    }
  }
);

MenuRoutes.route("/Menu/:id").get(authToken, async (req, res) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: new ObjectId(req.params.id) };
  const data = await db_connect.collection("Menu").find(myquery).toArray();

  if (data && data.length > 0) {
    console.log(data);
    console.log(myquery._id);
    res.json(data);
  } else {
    console.log("data is not found");
  }
});

MenuRoutes.route("/Menu/:id/update").put(async (req, res) => {
  let db_connect = dbo.getDb("Menu");
  console.log("req body")
  console.log(req.body);
  let myquery = { _id: new ObjectId(req.body.id) };
  console.log(myquery)

  let update = {};
  let query = ["name", "description", "price"];

  for (let check of query) {
    if (req.body[check] != null && req.body[check] != undefined) {
      update[check] = req.body[check];
      console.log(update[check]);
    }
  }

  let newvalues = {
    $set: update,
  };
  try {
    const result = await db_connect
      .collection("Menu")
      .findOneAndUpdate(myquery, newvalues, { returnDocument: "after" });

    console.log(result);

    if (result) {
      console.log("Update Result:", result);
      res.json(result.value);
    } else {
      console.log("No document matches the provided query.");
      res.status(404).send("Reservation not found");
    }
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).send(err.message);
  }
});

MenuRoutes.route("/Menu/delete").delete(async (req, res) => {
  let db_connect = dbo.getDb("Menu");
  console.log(`req body`)
    
  console.log(req.body);
  const menu = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      restaurantId: req.body.restaurantId
    };

    console.log(menu)
  
  let myquery = { restaurantId: menu.restaurantId, name : menu.name };
  console.log(myquery)

  db_connect
    .collection("Menu")
    .findOneAndDelete(myquery)
    .then(() => {
      console.log("Deleted");
    });
});

MenuRoutes.route("/Menu/Restaurant/:restaurantId").get(async (req, res) => {
  const db_connect = dbo.getDb();
  const restaurantId = req.params.restaurantId;
  console.log(restaurantId);
  if (!restaurantId) {
    return res.status(400).json({ message: "Missing restaurantId" });
  }

  try {
    const menuItems = await db_connect
      .collection("Menu")
      .find({ restaurantId })
      .toArray();

    if (menuItems) {
      res.json(menuItems);
    } else {
      res.status(404).json({ message: "Menu not found" });
    }
  } catch (error) {
    console.error("Error fetching Menu details:", error);
    res.status(500).json({
      message: "An error occurred while fetching Menu details.",
    });
  }
});

module.exports = MenuRoutes;
