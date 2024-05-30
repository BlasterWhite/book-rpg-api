const express = require("express");
const personnageController = require("../controllers/personnageController");

const router = express.Router();

router.get("/", personnageController.getAllPersonnage);
router.get("/:id", personnageController.getOnePersonnage);
router.get("/:id/aventure", personnageController.getAventureByPersonnage);
router.post("/", personnageController.createPersonnage);
router.put("/:id", personnageController.updatePersonnage);
router.put("/:id/events", personnageController.updatePersonnageFromEvents);
router.delete("/:id", personnageController.deletePersonnage);

module.exports = router;
