const sequelize = require("../db/db");
const bcrypt = require("bcrypt");

const User = require("../models/userModels");
const Aventure = require("../models/aventureModels");
const { Personnage } = require("../models/personnageModels");

exports.createUser = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const { email, firstname, lastname, password } = req.body;
    const mot_de_passe_crypte = await bcrypt.hash(password, 10);
    const userExist = await User.findOne({
      where: {
        mail: email,
      },
      transaction,
    });
    if (userExist !== null) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    const user = await User.create(
      {
        mail: email,
        nom: lastname,
        prenom: firstname,
        mot_de_passe: mot_de_passe_crypte,
      },
      {
        transaction,
        attributes: ["mail", "nom", "prenom"],
      },
    );
    transaction.commit();
    delete user.dataValues.mot_de_passe;
    res.status(201).json(user);
  } catch (error) {
    if (transaction) await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const users = await User.findAll({
      attributes: ["mail", "nom", "prenom"],
      transaction,
    });
    transaction.commit();
    res.status(200).json(users);
  } catch (error) {
    if (transaction) await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: ["mail", "nom", "prenom"],
      transaction,
    }); // SELECT * FROM User WHERE id = id;
    transaction.commit();
    res.status(200).json(user);
  } catch (error) {
    if (transaction) await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const { id } = req.params;
    const { mail, nom, prenom, password } = req.body;
    const mot_de_passe_crypte = await bcrypt.hash(password, 10);
    await User.update(
      { mail, nom, prenom, mot_de_passe: mot_de_passe_crypte },
      {
        where: {
          id,
        },
        transaction,
      },
    );
    transaction.commit();
    res.status(200).json({ message: "User updated" });
  } catch (error) {
    if (transaction) await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const { id } = req.params;
    await User.destroy({
      where: {
        id,
      },
      transaction,
    });
    transaction.commit();
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    if (transaction) await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

exports.getAllAventures = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const { idUser } = req.params;
    const aventures = await Aventure.findAll({
      where: {
        id_utilisateur: idUser,
      },
      transaction,
      include: [
        {
          model: User,
          as: "utilisateur",
          attributes: ["mail", "nom", "prenom"],
        },
        {
          model: Personnage,
          as: "personnage",
        },
      ],
    });
    transaction.commit();
    res.status(200).json(aventures);
  } catch (error) {
    if (transaction) await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

exports.getAventureById = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const { idUser, idAventure } = req.params;
    const aventure = await Aventure.findOne({
      where: {
        id: idAventure,
        id_utilisateur: idUser,
      },
      transaction,
    });
    transaction.commit();
    res.status(200).json(aventure);
  } catch (error) {
    if (transaction) await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};
