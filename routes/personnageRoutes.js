const express = require("express");
const personnageController = require("../controllers/personnageController");

const router = express.Router();

router.get("/", personnageController.getAllPersonnage);
router.get("/:id", personnageController.getOnePersonnage);
router.post("/", personnageController.createPersonnage);
router.put("/:id", personnageController.updatePersonnage);
router.delete("/:id", personnageController.deletePersonnage);

module.exports = router;