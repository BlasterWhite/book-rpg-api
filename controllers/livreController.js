const Livre = require("../models/livreModels");
const Image = require("../models/imageModels");
const Aventure = require("../models/aventureModels");
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
  try {
    const livres = await Aventure.findAll({
      include: [
        {
          model: Livre,
          attributes: [],
          required: true,
          duplicating: false,
          group: ["id"],
        },
      ],
      group: ["Livre.id"],
      order: sequelize.literal(
        'COUNT(DISTINCT "Aventure.id_utilisateur") DESC',
      ),
    });
    res.status(200).json(livres);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
