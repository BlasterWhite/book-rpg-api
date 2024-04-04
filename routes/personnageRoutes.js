const express = require("express");
const personnageController = require("../controllers/personnageController");

const router = express.Router();

router.get("/", personnageController.getAllPersonnage);
router.get("/:id", personnageController.getOnePersonnage);
router.post("/", personnageController.createPersonnage);
router.put("/:id", personnageController.updatePersonnage);
router.put("/:id/equipement", personnageController.updateEquipement);
router.put("/:id/armes", personnageController.updateArmes);
router.put("/:id/attributes", personnageController.updateAttributes);
router.delete("/:id", personnageController.deletePersonnage);

module.exports = router;
