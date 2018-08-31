const express = require("express");
const router = express.Router();

// Index route to the index page.
router.get("/", () => console.log("Hello World"));

module.exports = router;
