const sequelize = require("../db/db");

const Equipement = require("../models/equipementModels");

exports.getAllEquipement = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const equipement = await Equipement.findAll({
      transaction,
    });
    transaction.commit();
    res.status(200).json(equipement);
  } catch (error) {
    if (transaction) await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

exports.getOneEquipement = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const { id } = req.params;
    const equipement = await Equipement.findOne({
      where: {
        id,
      },
      transaction,
    });
    transaction.commit();
    res.status(200).json(equipement);
  } catch (error) {
    if (transaction) await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

exports.createEquipement = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const { nom, description, id_image, resistance } = req.body;
    const equipement = await Equipement.create(
      {
        nom,
        description,
        id_image,
        resistance,
      },
      { transaction },
    );
    transaction.commit();
    res.status(201).json(equipement);
  } catch (error) {
    if (transaction) await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

exports.updateEquipement = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const { id } = req.params;
    const { nom, description, id_image, resistance } = req.body;
    await Equipement.update(
      {
        nom,
        description,
        id_image,
        resistance,
      },
      {
        where: {
          id,
        },
        transaction,
      },
    );
    transaction.commit();
    res.status(200).json({ message: "Equipement updated" });
  } catch (error) {
    if (transaction) await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

exports.deleteEquipement = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const { id } = req.params;
    await Equipement.destroy({
      where: {
        id,
      },
      transaction,
    });
    transaction.commit();
    res.status(200).json({ message: "Equipement deleted" });
  } catch (error) {
    if (transaction) await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};
