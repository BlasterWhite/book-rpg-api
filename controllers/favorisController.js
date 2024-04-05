const Favoris = require("../models/favorisModels");
const sequelize = require("../db/db");

exports.getAllFavoris = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const {idUser } = req.params;
    const favoris = await Favoris.findAll({
      where: {
        id_utilisateur: idUser,
      },
      transaction
    });
    await transaction.commit();
    res.status(200).json(favoris);
  } catch (error) {
    if (transaction) await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

exports.getFavorisByLivre = async (req, res) => {
  let transaction;
  try {
    const { idLivre, idUser } = req.params;
    transaction = await sequelize.transaction();
    const favoris = await Favoris.findAll({
      where: {
        id_livre: idLivre,
        id_utilisateur: idUser,
      },
        transaction,
    });
    await transaction.commit();
    res.status(200).json(favoris);
  } catch (error) {
    if (transaction) await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

exports.createFavoris = async (req, res) => {
  let transaction;
  try {
    const { idUser } = req.params;
    const { id_livre } = req.body;
    transaction = await sequelize.transaction();
    const favoris = await Favoris.create({
      id_utilisateur: idUser,
      id_livre: id_livre
    }, { transaction });
    await transaction.commit();
    res.status(201).json(favoris);
  } catch (error) {
    if (transaction) await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

exports.updateFavoris = async (req, res) => {
  let transaction;
  try {
    const { idUser } = req.params;
    const { id_livre } = req.body;
    transaction = await sequelize.transaction();
    const favoris = await Favoris.findByPk(req.params.id, { transaction });
    await favoris.update(
      {
        id_utilisateur: idUser,
        id_livre,
      },
      { transaction },
    );
    await transaction.commit();
    res.status(200).json(favoris);
  } catch (error) {
    if (transaction) await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

exports.deleteFavoris = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    await Favoris.destroy({
      where: {
        id_utilisateur: req.params.idUser,
        id_livre: req.params.idLivre,
      },
      transaction,
    });
    // res.json({ message: `Favoris for book ${req.params.idLivre} deleted` });
    await transaction.commit();
    res
      .status(204)
      .json({ message: `Favoris for book ${req.params.idLivre} deleted` });
  } catch (error) {
    if (transaction) await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};
