const express = require("express");
const userController = require("../controllers/userController");
const favorisController = require("../controllers/favorisController");

const router = express.Router();

router.post("/login", userController.loginUser);

router.get("/aventures", userController.getAllAventures);
router.get("/aventures/:idAventure", userController.getAventureById);
router.get("/aventures/livres/:idLivre", userController.getAventureByIdLivre);

router.get("/favoris", favorisController.getAllFavoris);
router.get("/favoris/:idLivre", favorisController.getFavorisByLivre);
router.post("/favoris", favorisController.createFavoris);
router.put("/favoris/:id", favorisController.updateFavoris);
router.delete("/favoris/:idLivre", favorisController.deleteFavoris);

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
