const express = require("express");
const levenschteinController = require("../controllers/levenschteinController");

const router = express.Router();

router.post("/", levenschteinController.calculateLevenshteinDistance);

module.exports = router;
