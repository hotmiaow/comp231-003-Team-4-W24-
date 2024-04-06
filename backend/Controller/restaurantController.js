const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;
const jwt = require('jsonwebtoken');

async function getAllRestaurants(req, response) {
  let db_connect = dbo.getDb();

  try {
    var records = await db_connect.collection("Restaurants").find({}).toArray();
    response.json(records);
  } catch (e) {
    console.log("An error occurred pulling the records. " + e);
  }
};

async function getRestaurantIdByChefId(req,res){
  let db_connect = dbo.getDb();
  console.log('test')
  console.log(req.body)

  const checkId = req.body;

  const key = Object.keys(req.body)[0];
  const value = req.body[key];

  console.log(key);
  console.log(value);

  if(checkId){
    let myquery = checkId;
    console.log(myquery);

    try {
      var records = await db_connect.collection("Restaurants").findOne(myquery);
      console.log(records)
      console.log(records._id);

      console.log(`rest id is read`)
      res.json(records);
    } catch (e) {
      console.log("An error occurred pulling the records. " + e);
    }
  }
  
}

async function registerRestaurant(req, res)  {
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
    chefId: req.body.chefId,
    chefEmail: req.body.chefEmail
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
};

async function getRestaurantById(req, res) {
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
};


async function restaurantUpdateById(req, response) {
    let db_connect = dbo.getDb();
    let myquery = { _id: new ObjectId(req.params.id) };
    console.log(myquery)

    let update = {};
    let query = [
      "name",
      "location",
      "photo",
      "rating",
      "cuisine",
      "price",
      "description",
      "opening",
      "closing",
      "phone",
      "adminEmail",
      "readonlyEmail",
      "selectedImage",
      "adminId",
      "availability"
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
      .collection("Restaurants")
      .findOneAndUpdate(myquery, newvalues, { returnDocument: "after" })
      .then((res) => {
        console.log(res);
        response.json(res);
      })
      .catch((err) => {
        console.log(err);
        response.json(err);
      });
  };

async function restaurantDeleteById(req, response)  {
    let db_connect = dbo.getDb();
    let myquery = { _id: new ObjectId(req.params.id) };
    db_connect
      .collection("Restaurants")
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
  };

    async function updateRestaurantAvailability(restaurantId, peopleCount) {
    const db_connect = dbo.getDb();
    const myquery = { _id: new ObjectId(restaurantId) };
    const updateDoc = {
        $inc: { "availability": -peopleCount }
    };

    return db_connect.collection("Restaurants").updateOne(myquery, updateDoc);
}

async function myRestaurant(req, response) {
  let db_connect = dbo.getDb();
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  adminEmail = decoded.email;

  try {
    var records = await db_connect.collection("Restaurants").find({ adminEmail: adminEmail }).toArray();
    response.json(records);
  } catch (e) {
    console.log("An error occurred pulling the records. " + e);
  }
};
  

module.exports = {getAllRestaurants, getRestaurantById, getRestaurantIdByChefId, registerRestaurant, restaurantUpdateById, restaurantDeleteById, updateRestaurantAvailability, myRestaurant};