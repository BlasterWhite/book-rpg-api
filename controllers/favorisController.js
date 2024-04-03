const Favoris = require("../models/favorisModels");

exports.getAllFavoris = async (req, res) => {
  try {
    const favoris = await Favoris.findAll();
    res.json(favoris);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFavorisByLivre = async (req, res) => {
  try {
    const { idLivre } = req.params;
    const favoris = await Favoris.findAll({
      where: {
        id_livre: idLivre,
      },
    });
    res.json(favoris);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createFavoris = async (req, res) => {
  try {
    const { idUser } = req.params;
    const { id_livre } = req.body;
    const favoris = await Favoris.create({
      id_utilisateur: idUser,
      id_livre: id_livre,
    });
    res.status(201).json(favoris);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateFavoris = async (req, res) => {
  try {
    const { idUser } = req.params;
    const { id_livre } = req.body;
    const favoris = await Favoris.findByPk(req.params.id);
    await favoris.update({
      id_utilisateur: idUser,
      id_livre,
    });
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
