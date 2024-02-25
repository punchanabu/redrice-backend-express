const express = require("express");
const router = express.Router();

// GET route
router.get("/", (req, res) => {
    res.send("Hello, world!");
});

// POST route
router.post("/", (req, res) => {
    res.send("Received a POST request");
});

module.exports = router;
