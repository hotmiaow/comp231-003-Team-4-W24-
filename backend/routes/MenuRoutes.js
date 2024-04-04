const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const MenuRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

const authToken = require("../Auth/token");

const {
  updateRestaurantAvailability,
} = require("../Controller/restaurantController");
const { TopologyDescription } = require("mongodb");

// This section will help you get a list of all the records.
// get all Menu
MenuRoutes.route("/Menu").get(async function (req, response) {
  let db_connect = dbo.getDb();

  try {
    var records = await db_connect.collection("Menu").find({}).toArray();
    response.json(records);
  } catch (e) {
    console.log("An error occurred pulling the records. " + e);
  }
});

//register new Menu
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
      var records = await db_connect.collection("Menu").insertOne(menu).then((result) => {
        res.json(result);
        console.log(result);
      })
      .catch((err) => console.log(err));
    } catch (e) {
      console.log("An error occurred pulling the records. " + e);
    }

  
  }

  //     if(check){
  //       console.log("Availability : " + check.availability)
  //         if (Reservation.people <= check.availability) {
  //             await db_connect.collection("Reservation").insertOne(Reservation).then((result) => {
  //             console.log(result);
  //             res.json(result);})
  //            .catch((err) => console.error(err))}
  //             await updateRestaurantAvailability(req.body.restaurantId, Reservation.people);
  //             res.json({ message: "Reservation successful and availability updated" });
  //         }else{ console.log("availiablity not found.")}
  //         console.log(Reservation);

  //   }catch(err){
  //   console.error("Error processing reservation:", err);
  //   res.status(500).json({ error: "An error occurred processing the reservation" });
  // }

  // if (!check) {
  //   db_connect
  //     .collection("Reservation")
  //     .insertOne(Reservation)
  //     .then((result) => {
  //       console.log(result);
  //       res.json(result);
  //     })
  //     .catch((err) => console.error(err));
  // }
);

// This section will help you get a single record by id
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

// // This section will help you create a new record.
// restaurantRoutes.route("/record/add").post(function (req, response) {
//  let db_connect = dbo.getDb();
//  let myobj = {
//    name: req.body.name,
//    position: req.body.position,
//    level: req.body.level,
//  };
//  db_connect.collection("records").insertOne(myobj, function (err, res) {
//    if (err) throw err;
//    response.json(res);
//  });
// });

// This section will help you update a record by id.
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
      res.json(result.value); // send back the updated document
    } else {
      console.log("No document matches the provided query.");
      res.status(404).send("Reservation not found");
    }
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).send(err.message);
  }
});

// This section will help you delete a record
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

// This section will help you find the Menu for a Restaurant

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
      // Returning the relevant reservation details
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
