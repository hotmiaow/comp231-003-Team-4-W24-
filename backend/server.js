const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5500;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
app.use(
  cors({
    origin: "http://localhost:5173", // This is the location of the React app you're trying to connect from
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // These are the allowed http methods
    allowedHeaders: [
      "Accept",
      "Content-Type",
      "Authorization",
      "X-Requested-With",
    ], // These are the allowed headers
    credentials: true,
  })
);

// Importing Routes
const restaurantRoutes = require("./routes/RestaurantRoutes");
const dinerRoutes = require("./routes/DinerRoutes");
const userRoutes = require("./routes/UserRoutes");
const reservationRoutes = require("./routes/ReservationRoutes");
const restaurantOwnerRoutes = require("./routes/RestaurantOwnerRoutes");

// Using Routes
app.use("/restaurants", restaurantRoutes);
app.use("/diner", dinerRoutes);
app.use("/user", userRoutes);
app.use("/reservation", reservationRoutes);
app.use("/restaurant-owner", restaurantOwnerRoutes);

// Default Route
app.use("/", (req, res) => {
  res.send("Home page");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

