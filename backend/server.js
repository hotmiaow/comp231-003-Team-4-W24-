const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require('mongoose');

const port = process.env.PORT || 5500;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173",
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

// Import routes
app.use(require("./routes/RestaurantRoutes"));
app.use(require("./routes/DinerRoutes"));
app.use(require("./routes/UserRoutes"));
app.use(require("./routes/ReservationRoutes"));
app.use(require("./Auth/login"));

// Import availability route
const availabilityRoutes = require("./routes/AvailabilityRoutes");
app.use("/api", availabilityRoutes);

// Manually set MongoDB URI
const mongoURI = "mongodb+srv://ectablerev:Comp231_group4@cluster0.vcbnpu8.mongodb.net/Restaurants?retryWrites=true&w=majority";
//PORT=5000";

// Connect to MongoDB using Mongoose
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// API endpoints
app.get("/", (req, res) => {
  res.send("home page");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
