const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const availabilityRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;


availabilityRoutes.route("/Restaurants/:id/availability").post(async (req, res) => {
  const db_connect = dbo.getDb("availabilities");
  console.log(req.body.availability);

  const info = {
    restaurantId : req.body.restID,
    availability : parseInt(req.body.availability),
    date : req.body.date,
    time : req.body.time
  };

  const check = await db_connect
    .collection("availabilities")
    .findOne({ restaurantId : info.restaurantId, date: info.date, time: info.time });
  
    try{
        if(check){
            db_connect
            .collection("availabilities")
            .findOneAndUpdate({_id:check._id}, {$set: info}, {returnDocument: 'after'})
            .then((result) => {
                const msg = `Availability updated : from ${check.availability} to ${info.availability}`;
                console.log(msg);
                res.json({
                    success: true,
                    message: msg,
                    data: info
                });
                console.log(result);
                // console.log(info)
            })
            .catch((err) => {
                res.status(500).json({
                    success: false,
                    message: 'Failed to update availability.'
                });
                console.log(err);
            });
        
        
        }
        else if (!check) {
            db_connect
            .collection("availabilities")
            .insertOne(info)
            .then((result) => {
                const msg = `New availability ${info.availability} for ${info.date} - ${info.time} is created.`;
                console.log(msg)
                res.json({
                    success: true,
                    message : msg,
                    data: info
                });
                console.log(result);
                // console.log(info)
            })
            .catch((err) => {
                res.status(500).json({
                    success: false,
                    message: 'Failed to create new availability.'
                });
                console.log(err);
            });
        }
    }catch(err){
        console.log(`error in find availability record. ${err}`);
        res.json(err);
    }
      
  
});

module.exports = availabilityRoutes;