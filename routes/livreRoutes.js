const express = require("express");
const livreController = require("../controllers/livreController");

const router = express.Router();

router.get("/news", livreController.getAllNewLivres);
router.get("/", livreController.getAllLivres);
router.get("/:id", livreController.getLivreById);
router.post("/", livreController.createLivre);
router.put("/:id", livreController.updateLivre);
router.delete("/:id", livreController.deleteLivre);

module.exports = router;