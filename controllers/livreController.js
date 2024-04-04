const Livre = require("../models/livreModels");
const Image = require("../models/imageModels");
const sequelize = require("../db/db");

exports.createLivre = async (req, res) => {
  let transaction;
  try {
    const { titre, resume, id_image, tag, date_sortie } = req.body;
    transaction = await sequelize.transaction();
    let image;
    if (id_image) {
      image = await Image.findByPk(id_image, {
        transaction,
      });
    }
    if (!image) {
      image = await Image.create(
        {
          image: "https://picsum.photos/270/500",
        },
        { transaction },
      );
    }
    const livre = await Livre.create(
      {
        titre,
        resume,
        id_image: image.id,
        tag,
        date_sortie,
      },
      { transaction },
    );
    transaction.commit();
    res.status(201).json(livre);
  } catch (error) {
    if (transaction) await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

exports.getAllLivres = async (req, res) => {
  try {
    const livres = await Livre.findAll({
      attributes: ["id", "titre", "resume", "id_image", "tag", "date_sortie"],
      include: [
        {
          model: Image,
          as: "image",
          attributes: ["image"],
        },
      ],
    });
    res.status(200).json(livres);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLivreById = async (req, res) => {
  try {
    const { id } = req.params;
    const livre = await Livre.findByPk(id, {
      include: [
        {
          model: Image,
          as: "image",
          attributes: ["image"],
        },
      ],
    });
    res.status(200).json(livre);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateLivre = async (req, res) => {
  try {
    const { id } = req.params;
    const { titre, resume, id_image, tag, date_sortie } = req.body;
    await Livre.update(
      { titre, resume, id_image, tag, date_sortie },
      {
        where: {
          id,
        },
      },
    );
    res.status(200).json({ message: "Book updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteLivre = async (req, res) => {
  try {
    const { id } = req.params;
    await Livre.destroy({
      where: {
        id,
      },
    });
    res.status(200).json({ message: "Book deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllNewLivres = async (req, res) => {
  try {
    const livres = await Livre.findAll({
      attributes: ["titre", "resume", "id_image", "tag", "date_sortie"],
      order: [["date_sortie", "DESC"]],
      limit: 10,
    });
    res.status(200).json(livres);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllPopularLivres = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const livres = await sequelize.query(
      `SELECT l.titre, l.resume, l.id_image, l.tag, l.date_sortie
        FROM bookrpg.livre l
        JOIN bookrpg.aventure a ON l.id = a.id_livre
        GROUP BY l.id
        ORDER BY COUNT(DISTINCT a.id_utilisateur) DESC
        LIMIT 10;`,
      { type: sequelize.QueryTypes.SELECT, transaction },
    );
    // si le retour est un tableau vide on retourne la liste des livres
    if (livres.length === 0) {
      const livres = await Livre.findAll({
        order: [["date_sortie", "DESC"]],
        limit: 10,
      });
      transaction.commit();
      res.status(200).json(livres);
      return;
    }
    transaction.commit();
    res.status(200).json(livres);
  } catch (error) {
    if (transaction) await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};
