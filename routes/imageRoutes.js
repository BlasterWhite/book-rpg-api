const express = require("express");
const imageController = require("../controllers/imageController");

const router = express.Router();

router.post("/", imageController.createImage);
router.post("/b64image", imageController.createImageB64);
router.post("/url", imageController.createImageURL);
router.delete("/:id", imageController.deleteImage);

module.exports = router;
