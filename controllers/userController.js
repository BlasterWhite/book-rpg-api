const User = require("../models/userModels");

exports.createUser = async (req, res) => {
  try {
    const { mail, nom, prenom, mot_de_passe } = req.body;
    const user = await User.create({ mail, nom, prenom, mot_de_passe }); // INSERT INTO User (username, birthday) VALUES ('username',
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["mail", "nom", "prenom"],
    }); // SELECT username, birthday FROM User;
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id); // SELECT * FROM User WHERE id = id;
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { mail, nom, prenom, mot_de_passe } = req.body;
    await User.update(
      { mail, nom, prenom, mot_de_passe },
      {
        where: {
          id,
        },
      },
    ); // UPDATE User SET username = 'username', birthday = 'birthday' WHERE id = id;
    res.status(200).json({ message: "User updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.destroy({
      where: {
        id,
      },
    }); // DELETE FROM User WHERE id = id;
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
