const express = require("express");
const livreController = require("../controllers/livreController");
const sectionController = require("../controllers/sectionController");

const router = express.Router();

router.get("/news", livreController.getAllNewLivres);
router.get("/", livreController.getAllLivres);
router.get("/:id", livreController.getLivreById);
router.post("/", livreController.createLivre);
router.put("/:id", livreController.updateLivre);
router.delete("/:id", livreController.deleteLivre);

router.get("/:idLivre/sections", sectionController.getAllSections);
router.get("/:idLivre/sections/:idSection", sectionController.getSectionById);
router.post("/:idLivre/sections", sectionController.createSection);
router.put("/:idLivre/sections/:idSection", sectionController.updateSection);
router.delete("/:idLivre/sections/:idSection", sectionController.deleteSection);

module.exports = router;