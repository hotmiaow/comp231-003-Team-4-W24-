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
    origin: "https://ectable.netlify.app", 
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

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'Origin, X-Requested-With, Content-Type, Accept',
}

exports.handler = async (event, _context) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
    }
  }

  return {
    statusCode: 200,
    headers: {
      ...CORS_HEADERS,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      hello: 'browser!'
    })
  }
}

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
