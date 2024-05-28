const sequelize = require("../db/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/userModels");
const Aventure = require("../models/aventureModels");
const { Personnage } = require("../models/personnageModels");

exports.loginUser = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const { email, password } = req.body;
    const user = await User.findOne({
      where: {
        mail: email,
      },
      transaction,
      attributes: ["id", "mail", "mot_de_passe", "nom", "prenom", "permission"],
    });
    console.log(user.permission,password, user.mot_de_passe)
    if (!user) {
      return res.status(404).json({ error: "User not found !" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.mot_de_passe);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid user or password !" });
    }

    // si l'utilisateur à déjà un token on le supprime
    const token = jwt.sign(
      {
        id: user.id,
        email: user.mail,
        permission: user.permission
      },
      "sklLeevR0FHz5ha%2ys#",
      {
        expiresIn: "24h",
      },
    );
    await transaction.commit();
    res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.mail,
        lastname: user.nom,
        firstname: user.prenom,
        permission: user.permission
      },
    });
  } catch (error) {
    if (transaction) await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

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
        attributes: ["mail", "nom", "prenom", "permission"],
      },
    );
    await transaction.commit();
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
    if (req.user.permission !== "admin") {
        return res.status(403).json({ message: "You don't have the rights for this action" });
    }
    const users = await User.findAll({
      attributes: ["mail", "nom", "prenom", "permission"],
      transaction,
    });
    await transaction.commit();
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
    if (id !== req.user.id && req.user.permission !== "admin") {
        return res.status(403).json({ message: "You don't have the rights for this action" });
    }
    const user = await User.findByPk(id, {
      attributes: ["mail", "nom", "prenom"],
      transaction,
    }); // SELECT * FROM User WHERE id = id;
    await transaction.commit();
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
    if (id !== req.user.id && req.user.permission !== "admin") {
        return res.status(403).json({ message: "You don't have the rights for this action" });
    }
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
    await transaction.commit();
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
    if (id !== req.user.id && req.user.permission !== "admin") {
        return res.status(403).json({ message: "You don't have the rights for this action" });
    }

    await User.destroy({
      where: {
        id,
      },
      transaction,
    });
    await transaction.commit();
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
    const idUser = req.user.id;

    if (req.user.permission !== "admin") {
        return res.status(403).json({ message: "You don't have the rights for this action" });
    }

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
    await transaction.commit();
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
    const { idAventure } = req.params;
    const idUser = req.user.id;
    const aventure = await Aventure.findAll({
      where: {
        id: idAventure,
        id_utilisateur: idUser,
      },
      transaction,
    });
    await transaction.commit();
    res.status(200).json(aventure);
  } catch (error) {
    if (transaction) await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

exports.getAventureByIdLivre = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const { idLivre } = req.params;
    const idUser = req.user.id;
    const aventure = await Aventure.findAll({
      where: {
        id_utilisateur: idUser,
        id_livre: idLivre,
      },
      transaction,
    });
    await transaction.commit();
    res.status(200).json(aventure);
  } catch (error) {
    if (transaction) await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};
