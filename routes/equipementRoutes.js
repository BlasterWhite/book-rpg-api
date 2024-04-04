const express = require("express");
const equipementController = require("../controllers/equipementController");

const router = express.Router();

router.get("/", equipementController.getAllEquipement);
router.get("/:id", equipementController.getOneEquipement);
router.post("/", equipementController.createEquipement);
router.put("/:id", equipementController.updateEquipement);
router.delete("/:id", equipementController.deleteEquipement);

module.exports = router;
