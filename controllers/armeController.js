const sequelize = require("../db/db");

const Arme = require("../models/armeModels");

exports.getAllArme = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const arme = await Arme.findAll({
      transaction,
    });
    transaction.commit();
    res.status(200).json(arme);
  } catch (error) {
    if (transaction) await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

exports.getOneArme = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const { id } = req.params;
    const arme = await Arme.findOne({
      where: {
        id,
      },
      transaction,
    });
    transaction.commit();
    res.status(200).json(arme);
  } catch (error) {
    if (transaction) await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

exports.createArme = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const { titre, description, id_image, degats, durabilite } = req.body;
    const arme = await Arme.create(
      {
        titre,
        description,
        id_image,
        degats,
        durabilite,
      },
      { transaction },
    );
    transaction.commit();
    res.status(201).json(arme);
  } catch (error) {
    if (transaction) await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

exports.updateArme = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const { id } = req.params;
    const { titre, description, id_image, degats, durabilite } = req.body;
    await Arme.update(
      {
        titre,
        description,
        id_image,
        degats,
        durabilite,
      },
      {
        where: {
          id,
        },
        transaction,
      },
    );
    transaction.commit();
    res.status(200).json({ message: "Arme updated" });
  } catch (error) {
    if (transaction) await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

exports.deleteArme = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const { id } = req.params;
    await Arme.destroy({
      where: {
        id,
      },
      transaction,
    });
    transaction.commit();
    res.status(200).json({ message: "Arme deleted" });
  } catch (error) {
    if (transaction) await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};
