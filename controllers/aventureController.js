const Aventure = require("../models/aventureModels");

exports.createAventure = async (req, res) => {
  try {
    const aventure = await Aventure.create(...req.body);
    res.status(201).json(aventure);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllAventure = async (req, res) => {
  try {
    const aventure = await Aventure.findAll({
      attributes: [...Aventure.getAttributes()],
    });
    res.status(200).json(aventure);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOneAventure = async (req, res) => {
  try {
    const { id } = req.params;
    const aventure = await Aventure.findByPk(id);
    res.status(200).json(aventure);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateAventure = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      id_utilisateur,
      id_livre,
      id_section_actuelle,
      id_personnage,
      statut,
    } = req.body;
    await Aventure.update(
      { id_utilisateur, id_livre, id_section_actuelle, id_personnage, statut },
      {
        where: {
          id,
        },
      },
    );
    res.status(200).json({ message: "Aventure updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteAventure = async (req, res) => {
  try {
    const { id } = req.params;
    await Aventure.destroy({
      where: {
        id,
      },
    });
    res.status(200).json({ message: "Aventure deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
