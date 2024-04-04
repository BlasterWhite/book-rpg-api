const express = require("express");
const armesController = require("../controllers/armeController");

const router = express.Router();

router.get("/", armesController.getAllArme);
router.get("/:id", armesController.getOneArme);
router.post("/", armesController.createArme);
router.put("/:id", armesController.updateArme);
router.delete("/:id", armesController.deleteArme);

module.exports = router;
