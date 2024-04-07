const express = require("express");

const ReservationRoutes = express.Router();

const dbo = require("../db/conn");

const ObjectId = require("mongodb").ObjectId;

const authToken = require("../Auth/token");

const{updateRestaurantAvailability} = require('../Controller/restaurantController')

ReservationRoutes.route("/api/Reservation").get(async function (req, response) {
  let db_connect = dbo.getDb();

  try {
    var records = await db_connect.collection("Reservation").find({}).toArray();
    response.json(records);
  } catch (e) {
    console.log("An error occurred pulling the records. " + e);
  }
});

ReservationRoutes.route("/api/Reservation/register").post(async (req, res) => {
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

    try{
          const query = {_id : new ObjectId(req.body.restaurantId)};
          const check = await db_connect.collection("Restaurants").findOne(query, {projection: { "availability": 1, "_id": 0 } });
      
          const customQuery = {restaurantId : Reservation.restaurantId, date:Reservation.date, time:Reservation.time};
          const customAvailability = await db_connect.collection("availabilities").findOne(customQuery);

          const totalAvailability = customAvailability? customAvailability.availability : check.availability;

            console.log(req.body.date)
            console.log(req.body.time)
            console.log(req.body.people)
            let totalBooked = 0;

            console.log({
              restaurantId: req.body.restaurantId,
              date: req.body.date,
              time: req.body.time
            });

            const bookingAggregation = await db_connect.collection("Reservation").aggregate([
              {
                $match: {
                  restaurantId: req.body.restaurantId,
                  date: req.body.date,
                  time: req.body.time
                }
              },
              {
                $group: {
                  _id: null,
                  totalBooked: { $sum: { $toInt: "$people" } }
                }
              }
            ]).toArray();

            console.log(bookingAggregation)

            
            if (bookingAggregation.length > 0) {
              totalBooked = bookingAggregation[0].totalBooked;
            }

            console.log(`totalAvailability : ${totalAvailability}`)
            console.log(`totalBooked : ${totalBooked}`);
            
            console.log(`peopleRequesting : ${peopleRequesting}`);
            const remainingAvailability = totalAvailability - totalBooked;
            console.log(`remainingAvailability : ${remainingAvailability}`);

            if (remainingAvailability >= peopleRequesting){
                const response = await db_connect.collection("Reservation").insertOne(Reservation);
                console.log(response);
                res.json({ success: true, message: "Reservation successful.", remain: remainingAvailability, total: totalBooked});
              }
            
            else{
              console.log("Insufficient availability for the requested booking")
              res.json({ success: false, message: "An error occurred during booking", remain : remainingAvailability, total : totalBooked});
            }
                    
      }catch(err){
        console.error("Error processing reservation:", err);
        res.status(400).json({ success: false, message:"Insufficient availability for the requested booking", remain : remainingAvailability, total : totalBooked});}
});

ReservationRoutes.route("/api/Reservation/:id").get(authToken, async (req, res) => {
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

ReservationRoutes.route("/api/Reservation/:id/update").put(async (req, res) => {
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

ReservationRoutes.route("/api/Reservation/:id/delete").delete(async (req, res) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: new ObjectId(req.params.id) };

  db_connect
    .collection("Reservation")
    .findOneAndDelete(myquery)
    .then(() => {
      console.log("Deleted");
    });
});

ReservationRoutes.route("/api/Reservation/find").get(
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

ReservationRoutes.route("/api/Reservation/User/:userId").get(async (req, res) => {
  const db_connect = dbo.getDb("Reservation"); 
  const userId = req.params.userId; 

  const query = { dinerId: userId };

  try {
    const data = await db_connect
      .collection("Reservation")
      .find(query)
      .toArray(); 

    if (data && data.length > 0) {
      console.log(data);
      res.json(data); 
    } else {
      console.log("No data found for this user");
      res.status(404).json({ message: "No reservations found for this user." });
    }
  } catch (error) {
    console.error("Error accessing the database:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

ReservationRoutes.route("/api/Reservation/Admin/:adminId").get(async (req, res) => {
  const db_connect = dbo.getDb("Restaurant");
  const adminId = req.params.adminId;

  if (!ObjectId.isValid(adminId)) {
    return res.status(400).json({ message: "Invalid adminId." });
  }

  try {
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
 
    const reservations = await db_connect
      .collection("Reservation")
      .find({ restaurantId: { $in: restaurantIds } })
      .toArray();

    if (reservations.length > 0) {
      console.log("Reservations found:", reservations);
      res.json(reservations);
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

ReservationRoutes.route("/api/Reservation/readonly/:readonlyId").get(
  async (req, res) => {
    const db_connect = dbo.getDb("Restaurant");
    const readonlyId = req.params.readonlyId;

    if (!ObjectId.isValid(readonlyId)) {
      return res.status(400).json({ message: "Invalid readonlyId." });
    }

    try {
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

      const reservations = await db_connect
        .collection("Reservation")
        .find({ restaurantId: { $in: restaurantIds } })
        .toArray();

      if (reservations.length > 0) {
        console.log("Reservations found:", reservations);
        res.json(reservations); 
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
