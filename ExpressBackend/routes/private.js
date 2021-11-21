/**
 * This route is responsible for routing the middleware for the authentication processes
 */

const express = require("express");
const router = express.Router();
const { getPrivateData } = require("../controllers/private");
const { protect } = require("../middleware/auth");

//Route is protected
router.route("/").get(protect, getPrivateData);

module.exports = router;
