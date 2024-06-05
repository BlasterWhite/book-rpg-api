const express = require("express");
const enemyController = require("../controllers/enemyController");

const router = express.Router();

router.get("/", enemyController.getAllEnemy);
router.get("/:id", enemyController.getOneEnemy);
router.post("/", enemyController.createEnemy);
router.put("/:id", enemyController.updateEnemy);
router.delete("/:id", enemyController.deleteEnemy);

module.exports = router;