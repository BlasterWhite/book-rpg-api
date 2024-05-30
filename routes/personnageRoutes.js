const express = require("express");
const personnageController = require("../controllers/personnageController");
const personnageHistoryController = require("../controllers/personnageHistoryController");

const router = express.Router();

router.get("/", personnageController.getAllPersonnage);
router.get("/:id", personnageController.getOnePersonnage);
router.get("/:id/aventure", personnageController.getAventureByPersonnage);
router.get("/:id/history", personnageHistoryController.getPersonnageHistory);
router.post("/", personnageController.createPersonnage);
router.post("/:id/history", personnageHistoryController.createPersonnageHistory);
router.put("/:id", personnageController.updatePersonnage);
router.put("/:id/events", personnageController.updatePersonnageFromEvents);
router.put("/:id/history", personnageHistoryController.updatePersonnageHistory)
router.delete("/:id", personnageController.deletePersonnage);

module.exports = router;
