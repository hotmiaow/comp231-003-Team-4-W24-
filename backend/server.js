const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5500;
const mongoose = require('mongoose'); // Add Mongoose to your imports

// Since bodyParser.json() is deprecated and Express has its own, we can use that:
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add your CORS configuration as you have it already
app.use(
  cors({
    origin: "http://localhost:5173", // adapt this to your front-end app location
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Accept",
      "Content-Type",
      "Authorization",
      "X-Requested-With",
    ],
    credentials: true,
  })
);

// Import your routes
app.use(require("./routes/RestaurantRoutes"));
app.use(require("./routes/DinerRoutes"));
app.use(require("./routes/UserRoutes"));
app.use(require("./routes/ReservationRoutes"));
app.use(require("./Auth/login"));
const dbo = require("./db/conn");

// // Connect to MongoDB using Mongoose
// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB connected via Mongoose'))
//   .catch(err => console.error(err));

// Existing routes can be preceded by '/api' if you wish to have a specific API route prefix
// For example:
// app.use('/api/restaurants', require("./routes/RestaurantRoutes"));
// Adjust the above line to match how you want your API endpoints structured

app.get("/", (req, res) => {
  res.send("home page");
});

app.listen(port, async () => {
  // perform a database connection when server starts
  await dbo.connectToServer(function (err) {
    if (err) console.error(err);
  });
  console.log(`Server is running on port: ${port}`);
});
