const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5500;
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json())


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

app.use(require("./routes/RestaurantRoutes"));
app.use(require("./routes/UserRoutes"));
app.use(require("./routes/ReservationRoutes"));
app.use(require("./routes/EmailConfirmation"));
app.use(require("./routes/MenuRoutes"));
app.use(require("./routes/availability"))

app.use(require("./Auth/login"));

const dbo = require("./db/conn");

app.use("/", (req, res) => {
  res.send("home page");
});

app.listen(port, async () => {
  await dbo.connectToServer(function (err) {
    if (err) console.error(err);
  });
  console.log(`Server is running on port: ${port}`);
});
