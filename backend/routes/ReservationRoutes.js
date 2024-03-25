const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const ReservationRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

const authToken = require("../Auth/token");

// This section will help you get a list of all the records.
// get all restaurants
ReservationRoutes.route("/Reservation").get(async function (req, response) {
  let db_connect = dbo.getDb();

  try {
    var records = await db_connect.collection("Reservation").find({}).toArray();
    response.json(records);
  } catch (e) {
    console.log("An error occurred pulling the records. " + e);
  }
});

//register new restaurant
ReservationRoutes.route("/Reservation/register").post(async (req, res) => {
  const db_connect = dbo.getDb();
  console.log(req.body.restaurantId);
  const Reservation = {
    restaurantId: req.body.restaurantId,
    restaurantName: req.body.restaurantName,
    date: req.body.date,
    time: req.body.time,
    people: req.body.people,
    menuSelection: req.body.menuSelection,
    dinerId: req.body.dinerId,
  };

  const check = await db_connect.collection("Reservation").findOne({
    restaurantId: Reservation.restaurantId,
    dinerId: Reservation.dinerId,
    date: Reservation.date,
    time: Reservation.time,
  });

  console.log(Reservation);

  if (!check) {
    db_connect
      .collection("Reservation")
      .insertOne(Reservation)
      .then((result) => {
        console.log(result);
        res.json(result);
      })
      .catch((err) => console.error(err));
  }
});

// This section will help you get a single record by id
ReservationRoutes.route("/Reservation/:id").get(authToken, async (req, res) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: new ObjectId(req.params.id) };
  const data = await db_connect.collection("Reservation").findOne(myquery);

  if (data) {
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
ReservationRoutes.route("/Reservation/:id/update").put(async (req, res) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: new ObjectId(req.params.id) };

  let update = {};
  let query = ["date", "time", "people"];

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
      .collection("Reservation")
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
ReservationRoutes.route("/Reservation/:id/delete").delete(async (req, res) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: new ObjectId(req.params.id) };

  db_connect
    .collection("Reservation")
    .findOneAndDelete(myquery)
    .then(() => {
      console.log("Deleted");
    });
});

// This section will help you find the booking

ReservationRoutes.route("/Reservation/find").get(
  authToken,
  async (req, res) => {
    const db_connect = dbo.getDb();
    const userId = req.body.userId;
    const id = req.body.id;

    if (!userId || !id) {
      return res
        .status(400)
        .json({ message: "Missing userId or restaurantId" });
    }

    try {
      const reservation = await db_connect.collection("Reservation").findOne({
        userId: userId,
        id: id,
      });

      if (reservation) {
        // Returning the relevant reservation details
        const { date, time, people, menuSelection } = reservation;
        res.json({ date, time, people, menuSelection });
      } else {
        res.status(404).json({ message: "Reservation not found" });
      }
    } catch (error) {
      console.error("Error fetching reservation details:", error);
      res.status(500).json({
        message: "An error occurred while fetching reservation details.",
      });
    }
  }
);

ReservationRoutes.route("/Reservation/User/:userId").get(async (req, res) => {
  const db_connect = dbo.getDb("Reservation"); // Make sure to specify your database name if needed
  const userId = req.params.userId; // Assuming userId is a string

  // Query based on the userId field
  const query = { dinerId: userId };

  try {
    const data = await db_connect
      .collection("Reservation")
      .find(query)
      .toArray(); // Using .find() to get all matches

    if (data && data.length > 0) {
      console.log(data);
      res.json(data); // Respond with an array of reservations
    } else {
      console.log("No data found for this user");
      res.status(404).json({ message: "No reservations found for this user." });
    }
  } catch (error) {
    console.error("Error accessing the database:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

ReservationRoutes.route("/Reservation/Admin/:adminId").get(async (req, res) => {
  const db_connect = dbo.getDb("Restaurant");
  const adminId = req.params.adminId;

  // Validate adminId as a valid ObjectId
  if (!ObjectId.isValid(adminId)) {
    return res.status(400).json({ message: "Invalid adminId." });
  }

  try {
    // Step 1: Find all restaurant documents based on adminId
    const restaurants = await db_connect
      .collection("Restaurants")
      .find({ adminId: adminId })
      .toArray();

    console.log(restaurants);

    if (restaurants.length === 0) {
      console.log("No restaurants found for this adminId");
      return res
        .status(404)
        .json({ message: "No restaurants found for this adminId." });
    }

    const restaurantIds = restaurants.map((restaurant) =>
      restaurant._id.toString()
    );
    console.log("Restaurant IDS");
    console.log(restaurantIds);
    // Step 2: Find reservations associated with each restaurant's _id
    const reservations = await db_connect
      .collection("Reservation")
      .find({ restaurantId: { $in: restaurantIds } })
      .toArray();

    if (reservations.length > 0) {
      console.log("Reservations found:", reservations);
      res.json(reservations); // Respond with an array of reservations
    } else {
      console.log("No reservations found for these restaurants");
      res
        .status(404)
        .json({ message: "No reservations found for these restaurants." });
    }
  } catch (error) {
    console.error("Error accessing the database:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

ReservationRoutes.route("/Reservation/readonly/:readonlyId").get(
  async (req, res) => {
    const db_connect = dbo.getDb("Restaurant");
    const readonlyId = req.params.readonlyId;

    // Validate readonlyId as a valid ObjectId
    if (!ObjectId.isValid(readonlyId)) {
      return res.status(400).json({ message: "Invalid readonlyId." });
    }

    try {
      // Step 1: Find all restaurant documents based on adminId
      const restaurants = await db_connect
        .collection("Restaurants")
        .find({ readonlyId: readonlyId })
        .toArray();

      console.log(restaurants);

      if (restaurants.length === 0) {
        console.log("No restaurants found for this adminId");
        return res
          .status(404)
          .json({ message: "No restaurants found for this adminId." });
      }

      const restaurantIds = restaurants.map((restaurant) =>
        restaurant._id.toString()
      );
      console.log("Restaurant IDS");
      console.log(restaurantIds);
      // Step 2: Find reservations associated with each restaurant's _id
      const reservations = await db_connect
        .collection("Reservation")
        .find({ restaurantId: { $in: restaurantIds } })
        .toArray();

      if (reservations.length > 0) {
        console.log("Reservations found:", reservations);
        res.json(reservations); // Respond with an array of reservations
      } else {
        console.log("No reservations found for these restaurants");
        res
          .status(404)
          .json({ message: "No reservations found for these restaurants." });
      }
    } catch (error) {
      console.error("Error accessing the database:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);
module.exports = ReservationRoutes;
