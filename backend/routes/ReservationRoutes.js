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
  const Reservation = {
    id: req.body.id,
    date: req.body.date,
    time: req.body.time,
    people: req.body.people,
    menuSelection: req.body.menuSelection,
    userId: req.body.userId,
  };

  const check = await db_connect
    .collection("Reservation")
    .findOne({ name: Reservation.id });

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
ReservationRoutes.route("/Reservation/:id/update").post(
  authToken,
  async (req, response) => {
    let db_connect = dbo.getDb();
    let myquery = { _id: new ObjectId(req.params.id) };

    let update = {};
    let query = [
      "id",
      "Date",
      "Time",
      "People",
      "Menu1",
      "Menu2",
      "Menu3",
      "Menu4",
    ];

    for (let check of query) {
      if (req.query[check] != null && req.query[check] != undefined) {
        update[check] = req.query[check];
      }
    }

    let newvalues = {
      $set: update,
    };
    const result = await db_connect
      .collection("Reservation")
      .findOneAndUpdate(myquery, newvalues, { returnDocument: "after" })
      .then((res) => {
        console.log(res);
        response.json(res);
      })
      .catch((err) => {
        console.log(err);
        response.json(err);
      });
  }
);

// This section will help you delete a record
ReservationRoutes.route("/Reservation/:id/delete").delete(
  authToken,
  async (req, response) => {
    let db_connect = dbo.getDb();
    let myquery = { _id: new ObjectId(req.params.id) };
    db_connect
      .collection("Reservation")
      .findOneAndDelete(myquery, function (err, res) {
        if (err) {
          console.log(err);
        } else if (res.ok && res.value) {
          console.log("Deleted Record : ", res);
          response.json("Deleted Record : ", res);
        } else {
          console.log(`Data is not found`);
        }
      });
  }
);

// This section will help you find the booking

ReservationRoutes.route("/Reservation/find").get(
  authToken,
  async (req, res) => {
    const db_connect = dbo.getDb();
    const userId = req.body.userId;
    const id = req.body.id;

    if (!userId || !restaurantId) {
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

module.exports = ReservationRoutes;
