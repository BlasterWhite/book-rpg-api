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
    await Favoris.destroy({
      where: {
        id_utilisateur: req.params.idUser,
        id_livre: req.params.idLivre,
      },
    });
    res.json({ message: `Favoris for book ${req.params.idLivre} deleted` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
