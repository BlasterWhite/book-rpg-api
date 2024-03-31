const Section = require("../models/sectionModels");

exports.createSection = async (req, res) => {
    try {
        const { id_livre, numero_section, texte, id_image, type } = req.body;
        const section = await Section.create({ id_livre, numero_section, texte, id_image, type });
        res.status(201).json(section);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllSections = async (req, res) => {
    try {
      const sections = await Section.findAll({
        attributes: ["id_livre", "numero_section", "texte", "id_image", "type"],
      });
      res.status(200).json(sections);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

exports.getSectionById = async (req, res) => {
    try {
      const { id } = req.params;
      const section = await Section.findByPk(id, {
        include: [{
            model: Section,
            through: 'association_liaison_section',
            as: 'sections'
        }]});
      res.status(200).json(section);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

exports.updateSection = async (req, res) => {
    try {
      const { id } = req.params;
      const { id_livre, numero_section, texte, id_image, type } = req.body;
      await Section.update(
        { id_livre, numero_section, texte, id_image, type },
        {
          where: {
            id,
          },
        },
      );
      res.status(200).json({ message: "Section updated" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};
  
exports.deleteSection = async (req, res) => {
try {
    const { id } = req.params;
    await Section.destroy({
    where: {
        id,
    },
    });
    res.status(200).json({ message: "Section deleted" });
} catch (error) {
    res.status(500).json({ error: error.message });
}
};