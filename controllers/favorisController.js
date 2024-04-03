const Favoris = require("../models/favorisModels");

exports.getAllFavoris = async (req, res) => {
  try {
    const favoris = await Favoris.findAll();
    res.json(favoris);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFavorisByUser = async (req, res) => {
  try {
    const favoris = await Favoris.findAll({
      where: { id_utilisateur: req.params.id },
    });
    res.json(favoris);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createFavoris = async (req, res) => {
  try {
    const favoris = await Favoris.create(req.body);
    res.status(201).json(favoris);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateFavoris = async (req, res) => {
  try {
    const favoris = await Favoris.findByPk(req.params.id);
    await favoris.update(req.body);
    res.json(favoris);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteFavoris = async (req, res) => {
  try {
    const favoris = await Favoris.findByPk(req.params.id);
    await favoris.destroy();
    res.json({ message: `Favoris ${req.params.id} deleted` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
