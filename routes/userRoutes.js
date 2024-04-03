const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

router.get("/:idUser/aventures", userController.getAllAventures);
router.get("/:idUser/aventures/:idAventure", userController.getAventureById);

module.exports = router;
