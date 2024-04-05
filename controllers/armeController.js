const sequelize = require("../db/db");

const Image = require("../models/imageModels");
const Arme = require("../models/armeModels");

exports.getAllArme = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const arme = await Arme.findAll({
      include: [
        {
          model: Image,
          as: "image",
          attributes: ["image"],
        },
      ],
      transaction,
    });
    await transaction.commit();
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
      include: [
        {
          model: Image,
          as: "image",
          attributes: ["image"],
        },
      ],
      transaction,
    });
    await transaction.commit();
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
    let image;
    if (id_image) {
      image = await Image.findByPk(id_image, {
        transaction,
      });
    }
    if (!image) {
      image = await Image.create({
        image: "https://picsum.photos/270/500",
      });
    }
    const arme = await Arme.create(
      {
        titre,
        description,
        id_image: image.id,
        degats,
        durabilite,
      },
      {
        transaction,
      },
    );
    await transaction.commit();
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
        transaction
      },
    );
    await transaction.commit();
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
    await transaction.commit();
    res.status(200).json({ message: "Arme deleted" });
  } catch (error) {
    if (transaction) await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};
