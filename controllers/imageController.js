const Image = require("../models/imageModels");

exports.getAllImages = async (req, res) => {
  try {
    const images = await Image.findAll();
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOneImage = async (req, res) => {
  try {
    const image = await Image.findByPk(req.params.id);
    res.json(image);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createImage = async (req, res) => {
  try {
    const image = await Image.create(req.body);
    res.json(image);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateImage = async (req, res) => {
  try {
    const image = await Image.findByPk(req.params.id);
    await image.update(req.body);
    res.json(image);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const image = await Image.findByPk(req.params.id);
    await image.destroy();
    res.json({ message: `Image ${req.params.id} deleted` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
