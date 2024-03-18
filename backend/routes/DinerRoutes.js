const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const dinerRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

const authToken = require("../Auth/token");
console.log(authToken);

dinerRoutes.route("/Diner/register").post(async (req, res) => {
  const db_connect = dbo.getDb();
  const diner = {
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
    phone: req.body.phone,
  };

  const check = await db_connect
    .collection("Diner")
    .findOne({ email: diner.email });

  if (!check) {
    db_connect
      .collection("Diner")
      .insertOne(diner)
      .then((result) => {
        res.json(result);
        console.log(result);
      })
      .catch((err) => console.log(err));
  }
});

dinerRoutes.route("/Diner").get(async function (req, response) {
  let db_connect = dbo.getDb();

  try {
    var records = await db_connect.collection("Diner").find({}).toArray();
    response.json(records);
  } catch (e) {
    console.log("An error occurred pulling the records. " + e);
  }
});

dinerRoutes.route("/Diner/:id").get(async (req, res) => {
  const db_connect = dbo.getDb();
  let myquery = { _id: new ObjectId(req.params.id) };
  const data = await db_connect.collection("Diner").findOne(myquery);

  if (data) {
    console.log(data);
    console.log(myquery._id);
    res.json(data);
  } else {
    console.log("data is not found");
  }
});

dinerRoutes.route("/Diner/:id/update").post(async (req, response) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: new ObjectId(req.params.id) };

  let update = {};
  let query = ["email", "password", "name", "phone"];

  for (let check of query) {
    if (req.query[check] != null && req.query[check] != undefined) {
      update[check] = req.query[check];
    }
  }

  let newvalues = {
    $set: update,
  };
  const result = await db_connect
    .collection("Diner")
    .findOneAndUpdate(myquery, newvalues, { returnDocument: "after" })
    .then((res) => {
      console.log(res);
      response.json(res);
    })
    .catch((err) => {
      console.log(err);
      response.json(err);
    });
});

// dinerRoutes.get('/Diner/:id/protected', authToken, (req,res)=>{
//   res.json({ message: "This is a protected route" });
// })

module.exports = dinerRoutes;
