/**
 * The app.js file is responsible for starting the express server in the backend
 */

require("dotenv").config({ path: "./config.env" }); // dotenv is module that loads environment variables from our config.env file into process.env.| Source for dotenv: https://www.npmjs.com/package/dotenv
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan"); // HTTP request logger middleware for node.js | Source: https://www.npmjs.com/package/morgan
const cors = require("cors"); // Source: https://www.npmjs.com/package/cors
const bodyParser = require("body-parser");
const connectDB = require("./config/db"); // Create DB connection
const errorHandler = require("./middleware/error"); // ErrorMessages

// Connect DB
connectDB();

// Route connections
const memesRouter = require("./routes/memes");
const webshotRouter = require("./routes/webshot");

const app = express();

/**
 * Get port from environment and store in Express.
 */
const PORT = process.env.PORT || 3001;
// Message is logged when the server starts
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// view engine setup
app.use(cors());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(logger("dev"));
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/memes", memesRouter); // Route to Memes from Imgflip API
app.use("/webshot", webshotRouter); // Route to own Templates API
app.use("/api/auth", require("./routes/auth")); // authentication Route
app.use("/api/private", require("./routes/private")); // private Route => See authentication

//Error Handler (Should be last piece of middleware)
app.use(errorHandler);

module.exports = app;
