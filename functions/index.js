/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require('firebase-functions')
const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const express = require("express");
const cors = require('cors');

// require("dotenv").config({ path: "./config.env" });
// const port = process.env.PORT || 5500;
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser')


// const corsOptions = {
//   origin: "https://ectable-7april.web.app",
// };
const app = express();
// app.use(
//   cors({
//     origin: "https://ectable-7april.web.app", 
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: [
//       "Accept",
//       "Content-Type",
//       "Authorization",
//       "X-Requested-With",
    
//     ], 
//     credentials: true,
//   })
// );

// const allowedOrigins = [
//   "https://ectable-7april.web.app",
// ];

// // Reflect the origin if it's in the allowed list or not defined (cURL, Postman, etc.)
// const corsOptions = {
//   origin: (origin, callback) => {
//     if (allowedOrigins.includes(origin) || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error('Origin not allowed by CORS'));
//     }
//   },
// };

// Enable preflight requests for all routes
// app.options('*', cors(corsOptions));
app.use(cors({ origin: 'https://ectable-7april.web.app' }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Origin', 'https://ectable-7april.web.app');
  res.setHeader("Access-Control-Allow-Methods", "GET", "POST", "PUT", "DELETE", "OPTIONS");
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});



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


// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json())




app.use(require("./routes/RestaurantRoutes"));
app.use(require("./routes/UserRoutes"));
app.use(require("./routes/ReservationRoutes"));
app.use(require("./routes/EmailConfirmation"));
app.use(require("./routes/MenuRoutes"));
app.use(require("./routes/availability"))

app.use(require("./Auth/login"));

const dbo = require("./db/conn");

app.use("/", (req, res) => {
  res.send("Hello from ECTable backend!");
});

exports.ectable = functions.https.onRequest(app);

// exports.ectable = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });