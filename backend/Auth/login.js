const express = require("express");
const dbo = require("../db/conn");
const login = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "./token.env" });
const ObjectId = require("mongodb").ObjectId;

login.post("/api/diner/login", async (req, res) => {
  try {
    const dinerEmail = req.body.email;
    const dinerPwd = req.body.password;
    const db = dbo.getDb();

    const check = await db
      .collection("User")
      .findOne({ email: dinerEmail, password: dinerPwd });

    if (check) {
      console.log("Login Successful!");
      const accToken = jwt.sign(
        { email: dinerEmail },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );
      const refToken = jwt.sign(
        { email: dinerEmail },
        process.env.REFRESH_TOKEN_SECRET
      );
      res.json({
        message: "Logged in successfully",
        accessToken: accToken,
        refreshToken: refToken,
        id: check._id,
        email : check.email,
        restId : check.restaurantId,
        restName : check.restaurantName
      });
    } else {
      console.log("Failed to Log in");
      res.status(401).json({success: false, message:"Failed to Login in. Incorrect email or password."})
    }
  } catch (e) {
    console.error(e);
  }
});

module.exports = login;
