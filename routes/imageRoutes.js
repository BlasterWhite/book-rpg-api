const express = require("express");
const imageController = require("../controllers/imageController");

const router = express.Router();

router.get("/", imageController.getAllImages);
router.get("/:id", imageController.getOneImage);
router.post("/", imageController.createImage);
router.post("/b64image", imageController.createImageB64);
router.post("/url", imageController.createImageURL);
router.put("/:id", imageController.updateImage);
router.delete("/:id", imageController.deleteImage);

module.exports = router;
