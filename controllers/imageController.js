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
    if (!req.body.prompt) {
      return res.status(400).json({ error: "Please provide a prompt" });
    }

    fetch("https://api.getimg.ai/v1/essential/text-to-image", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authorization: `Bearer ${process.env.KEY}`,
      },
      body: JSON.stringify({
        prompt: req.body.prompt.toString(),
      }),
    })
      .then((response) => response.json())
      .then(async (response) => {
        if (response.error) {
          return res.status(400).json({ error: response.error });
        }
        console.log(response.image);
        const image = await Image.create({ image: response.image });
        res.status(201).json(image);
      })
      .catch((err) => res.status(500).json({ error: err.message }));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createImageB64 = async (req, res) => {
  try {
    if (!req.body.image) {
      return res.status(400).json({ error: "Please provide an image" });
    }

    const image = await Image.create({ image: req.body.image });
    res.status(201).json(image);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createImageURL = async (req, res) => {
  try {
    if (!req.body.url) {
      return res.status(400).json({ error: "Please provide an url" });
    }

    const image = await Image.create({ image: req.body.url });
    res.status(201).json(image);
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
