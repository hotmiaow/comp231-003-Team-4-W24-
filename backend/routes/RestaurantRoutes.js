const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const restaurantRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

const authToken = require("../Auth/token");

const {
  getAllRestaurants,
  getRestaurantById,
  registerRestaurant,
  restaurantUpdateById,
  restaurantDeleteById,
} = require("../Controller/restaurantController");
const { route } = require("./ReservationRoutes");



// This section will help you get a list of all the records.
// get all restaurants

restaurantRoutes.route("/Restaurants").get(async function (req, response) {
  let db_connect = dbo.getDb();

  try {
    var records = await db_connect.collection("Restaurants").find({}).toArray();
    response.json(records);
  } catch (e) {
    console.log("An error occurred pulling the records. " + e);
  }
});

//register new restaurant
restaurantRoutes.route("/Restaurants/register").post(async (req, res) => {
  const db_connect = dbo.getDb();
  const restaurant = {
    name: req.body.name,
    location: req.body.location,
    photo: req.body.photo,
    rating: req.body.rating,
    cuisine: req.body.cuisine,
    price: req.body.price,
    description: req.body.description,
    opening: req.body.opening,
    closing: req.body.closing,
    adminEmail: req.body.adminEmail,
    readonlyEmail: req.body.readonlyEmail,
    selectedImage: req.body.selectedImage,
    adminId: req.body.adminId,
    readonlyId: req.body.readonlyId,
    availability: req.body.availability,
  };

  const check = await db_connect
    .collection("Restaurants")
    .findOne({ name: restaurant.name });

  if (!check) {
    db_connect
      .collection("Restaurants")
      .insertOne(restaurant)
      .then((result) => {
        console.log(result);
        res.json(result);
      })
      .catch((err) => console.error(err));
  }
});

// This section will help you get a single record by id
restaurantRoutes.route("/Restaurants/:id").get(async (req, res) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: new ObjectId(req.params.id) };
  const data = await db_connect.collection("Restaurants").findOne(myquery);

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

// // This section will help you update a record by id.
// restaurantRoutes
//   .route("/Restaurants/:id/update")
//   .post(authToken, async (req, response) => {
//     let db_connect = dbo.getDb();
//     let myquery = { _id: new ObjectId(req.params.id) };

//     let update = {};
//     let query = [
//       // "name",
//       // "location",
//       // "photo",
//       // "rating",
//       // "cuisine",
//       // "description",
//       // "closing",
//       // "opening",
//       // "phone",
//       // "email",
//       "name",
//       "location",
//       "photo",
//       "rating",
//       "cuisine",
//       "price",
//       "description",
//       "opening",
//       "closing",
//       "phone",
//       "adminEmail",
//       "readonlyEmail",
//       "selectedImage",
//       "adminId",
//       "availability"
//     ];

//     for (let check of query) {
//       if (req.query[check] != null && req.query[check] != undefined) {
//         update[check] = req.query[check];
//       }
//     }

//     let newvalues = {
//       $set: update,
//     };
//     const result = await db_connect
//       .collection("Restaurants")
//       .findOneAndUpdate(myquery, newvalues, { returnDocument: "after" })
//       .then((res) => {
//         console.log(res);
//         response.json(res);
//       })
//       .catch((err) => {
//         console.log(err);
//         response.json(err);
//       });
//   });

// // This section will help you delete a record
// restaurantRoutes
//   .route("/Restaurants/:id/delete")
//   .delete(authToken, async (req, response) => {
//     let db_connect = dbo.getDb();
//     let myquery = { _id: new ObjectId(req.params.id) };
//     db_connect
//       .collection("Restaurants")
//       .findOneAndDelete(myquery, function (err, res) {
//         if (err) {
//           console.log(err);
//         } else if (res.ok && res.value) {
//           console.log("Deleted Record : ", res);
//           response.json("Deleted Record : ", res);
//         } else {
//           console.log(`Data is not found`);
//         }
//       });
//   });

restaurantRoutes.get("/restaurants", getAllRestaurants);
restaurantRoutes.get("/restaurants/:id", getRestaurantById);
restaurantRoutes.post("/restaurants/register", registerRestaurant);
restaurantRoutes.post("/restaurants/:id/update", restaurantUpdateById);
restaurantRoutes.delete("/restaurants/:id/delete", restaurantDeleteById);

// My Restaurants
restaurantRoutes.route('/MyRestaurants').get(async function (req, response) {
  const jwt = require('jsonwebtoken');
  let db_connect = dbo.getDb();
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  adminEmail = decoded.email;
  //console.log('adminemail:', adminEmail)
  try {
    var records = await db_connect.collection("Restaurants").find({ adminEmail: adminEmail }).toArray();
    response.json(records);
  } catch (e) {
    console.log("An error occurred pulling the records. " + e);
  }
});

/*
  Menu Items
*/
// Post menu items for a particular restaurant
restaurantRoutes.post('/menuitems/:restaurantId', async (req, res) => {
  const { restaurantId } = req.params;
  const { menuItems } = req.body;

  let db_connect = dbo.getDb();
  
  // console.log('calling deleteMany');
  const deleteResult = await db_connect
    .collection("MenuItem")
    .deleteMany({ restaurantId: {$in: [restaurantId] }});
  // console.log(`Deleted ${deleteResult.deletedCount} items`);
    
  //console.log('Calling insert:');
  if (Array.isArray(menuItems) && menuItems.length) {
    const insertedItems = db_connect
      .collection("MenuItem")
      .insertMany(menuItems.map((item) => ({ ...item, restaurantId })))
    // console.log('Ending insert');
    res.status(200).json(insertedItems);
  } else {
    // console.log('Failed to insert');
    res.status(400).json(insertedItems);
  }
});

// Get menu items for a particular restaurant
restaurantRoutes.get('/menuitems/:restaurantId', async (req, res) => {
  const { restaurantId } = req.params;
  try {
    let db_connect = dbo.getDb();
    const menuItems = await db_connect
      .collection("MenuItem")
      .find({ restaurantId: restaurantId }).toArray();
      res.status(200).json(menuItems);
  } catch (error) {
    console.error('Error fetching menu items:', error); 
    res.status(500).json({ message: 'Error fetching menu items', error });
  }
});

module.exports = restaurantRoutes;
