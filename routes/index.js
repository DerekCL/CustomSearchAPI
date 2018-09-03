const express = require("express");
const router = express.Router();
const indexRoute = require("../lib/index");

// Index route to the index page.
router.post("/", indexRoute);

module.exports = router;
