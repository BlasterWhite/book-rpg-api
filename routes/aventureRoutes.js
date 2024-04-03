const express = require("express");
const aventureController = require("../controllers/aventureController");

const router = express.Router();

router.get("/", aventureController.getAllAventure);
router.get("/:id", aventureController.getOneAventure);
router.post("/", aventureController.createAventure);
router.put("/:id", aventureController.updateAventure);
router.delete("/:id", aventureController.deleteAventure);

module.exports = router;
