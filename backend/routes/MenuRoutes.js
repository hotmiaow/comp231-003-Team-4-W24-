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

// This section will help you get a list of all the records.
// get all restaurants
MenuRoutes.route("/Menu").get(async function (req, response) {
  let db_connect = dbo.getDb();

  try {
    var records = await db_connect.collection("Menu").find({}).toArray();
    response.json(records);
  } catch (e) {
    console.log("An error occurred pulling the records. " + e);
  }
});

//register new restaurant
MenuRoutes.route("/Menu/register").post(async (req, res) => {
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

  const peopleRequesting = parseInt(req.body.people);

  // const check = await db_connect
  //   .collection("Reservation")
  //   .findOne({ restaurantId: Reservation.restaurantId, dinerId : Reservation.dinerId, date: Reservation.date, time: Reservation.time });

  //   .insertOne(Reservation);
  try {
    const query = { _id: new ObjectId(req.body.restaurantId) };
    const check = await db_connect
      .collection("Menu")
      .findOne(query, { projection: { availability: 1, _id: 0 } });
    // const bookingquery = { restaurantId : new ObjectId(req.body.restaurantId), date : req.body.date, time: req.body.time }
    // const booking = await db_connect.collection("Reservation").find(bookingquery);
    // console.log(booking);

    const totalAvailability = check.availability;

    console.log(req.body.date);
    console.log(req.body.time);
    console.log(req.body.people);
    let totalBooked = 0;

    console.log({
      restaurantId: req.body.restaurantId,
      date: req.body.date,
      time: req.body.time,
    });

    const bookingAggregation = await db_connect
      .collection("Menu")
      .aggregate([
        {
          $match: {
            restaurantId: req.body.restaurantId, // Ensure this matches your schema's data type
            date: req.body.date,
            time: req.body.time,
          },
        },
        {
          $group: {
            _id: null,
            totalBooked: { $sum: { $toInt: "$people" } },
          },
        },
      ])
      .toArray();

    console.log(bookingAggregation);

    if (bookingAggregation.length > 0) {
      totalBooked = bookingAggregation[0].totalBooked;
    }

    console.log(`totalAvailability : ${totalAvailability}`);
    console.log(`totalBooked : ${totalBooked}`);

    console.log(`peopleRequesting : ${peopleRequesting}`);
    const remainingAvailability = totalAvailability - totalBooked;
    console.log(`remainingAvailability : ${remainingAvailability}`);

    if (remainingAvailability >= peopleRequesting) {
      const response = await db_connect
        .collection("Reservation")
        .insertOne(Reservation);
      console.log(response);
      res.json({
        success: true,
        message: "Reservation successful.",
        remain: remainingAvailability,
        total: totalBooked,
      });
    } else {
      console.log("Insufficient availability for the requested booking");
      res.json({
        success: false,
        message: "An error occurred during booking",
        remain: remainingAvailability,
        total: totalBooked,
      });
    }
  } catch (err) {
    console.error("Error processing reservation:", err);
    res.status(400).json({
      success: false,
      message: "Insufficient availability for the requested booking",
      remain: remainingAvailability,
      total: totalBooked,
    });
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
});

// This section will help you get a single record by id
MenuRoutes.route("/Menu/:id").get(authToken, async (req, res) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: new ObjectId(req.params.id) };
  const data = await db_connect.collection("Menu").findOne(myquery);

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
MenuRoutes.route("/Menu/:id/update").put(async (req, res) => {
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
MenuRoutes.route("/Menu/:id/delete").delete(async (req, res) => {
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

MenuRoutes.route("/Menu/find").get(authToken, async (req, res) => {
  const db_connect = dbo.getDb();
  const userId = req.body.userId;
  const id = req.body.id;

  if (!userId || !id) {
    return res.status(400).json({ message: "Missing userId or restaurantId" });
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
});

MenuRoutes.route("/Menu/User/:chefId").get(async (req, res) => {
  const db_connect = dbo.getDb("Menu");
  const readonlyId = req.params.chefId;

  // Validate readonlyId as a valid ObjectId
  if (!ObjectId.isValid(chefId)) {
    return res.status(400).json({ message: "Invalid readonlyId." });
  }

  try {
    // Step 1: Find all restaurant documents based on adminId
    const restaurants = await db_connect
      .collection("Menu")
      .find({ chefId: chefId })
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
module.exports = MenuRoutes;
