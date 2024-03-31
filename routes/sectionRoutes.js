const express = require("express");
const sectionController = require("../controllers/sectionController");

const router = express.Router();

router.get("/", sectionController.getAllSections);
router.get("/:id", sectionController.getSectionById);
router.post("/", sectionController.createSection);
router.put("/:id", sectionController.updateSection);
router.delete("/:id", sectionController.deleteSection);

module.exports = router;