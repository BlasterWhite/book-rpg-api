const express = require("express");
const levenschteinController = require("../controllers/levenschteinController");

const router = express.Router();

router.get("/", levenschteinController.calculateLevenshteinDistance);

module.exports = router;
