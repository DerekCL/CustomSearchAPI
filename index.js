// Environment Variables
require("dotenv").config();

// module imports
const compression = require("compression");
const express = require("express");
const winston = require("winston");
const expressWinston = require("express-winston");
const helmet = require("helmet");
const routes = require("./routes");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

// module configuration
const app = express();
const port = process.env.PORT || 7000;

// winston request logging
// middleware to log your HTTP requests
app.use(
  expressWinston.logger({
    transports: [
      new winston.transports.Console({
        json: true,
        colorize: true,
      }),
    ],
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}}",
    expressFormat: true,
    colorize: false,
    ignoreRoute: () => {
      return false;
    },
  })
);

// app configuration
app.use(compression());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

const corsOption = {
  origin: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  exposedHeaders: ["x-auth-token"],
};
app.use(cors(corsOption));

app.use("search/v1/", routes);

// if (process.env.NODE_ENV === "production") {
//   // Cors configuration
//   var whitelist = ["http://localhost:5000"];
//   var corsOptions = {
//     origin: function(origin, callback) {
//       if (whitelist.indexOf(origin) !== -1) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//   };
//   // routes
//   app.use("/", cors(corsOptions), routes);
// } else {
//   // routes
//   app.use("/", cors(), routes);
// }

/**
 * winston error logging
 * middleware that log the errors of the pipeline.
 */
app.use(
  expressWinston.errorLogger({
    transports: [
      new winston.transports.Console({
        json: true,
        colorize: true,
      }),
    ],
  })
);

// starting the server
app.listen(port, () => console.log(`started on ${port}`));

module.exports = app;
