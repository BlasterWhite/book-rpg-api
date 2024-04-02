const Resultat = require("../models/resultatModels");
const Section = require("../models/sectionModels");

exports.createSection = async (req, res) => {
    try {
      const { idLivre } = req.params;
      const { numero_section, texte, id_image, type } = req.body;

      const section = await Section.create({ id_livre:Number(idLivre), numero_section, texte, id_image, type });
      res.status(201).json(section);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

exports.getAllSections = async (req, res) => {
    try {
      const { idLivre } = req.params;
      const sections = await Section.findAll({
        attributes: ["id_livre", "numero_section", "texte", "id_image", "type"],
        where: {
          id_livre: idLivre
        },
        include: [
          {
            model: Resultat,
            as: 'resultats',
          },
          {
            model: Section,
            as: 'sections',
            through: 'association_liaison_section',
            foreignKey: 'id_section_source',
            otherKey: 'id_section_destination',
          }
        ]
      });
      res.status(200).json(sections);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

exports.getSectionById = async (req, res) => {
    try {
      const { idLivre, idSection } = req.params;
      const section = await Section.findOne({
        where: {
          id_livre: idLivre,
          id: idSection
        },
        include: [
          {
            model: Resultat,
            as: 'resultats',
          },
          {
            model: Section,
            as: 'sections',
            through: 'association_liaison_section',
            foreignKey: 'id_section_source',
            otherKey: 'id_section_destination',
          }
        ]});
      res.status(200).json(section);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

exports.updateSection = async (req, res) => {
    try {
      const { idLivre, idSection } = req.params;
      const { numero_section, texte, id_image, type } = req.body;
      await Section.update(
        { id_livre: Number(idLivre), numero_section, texte, id_image, type },
        {
          where: {
            id_livre: idLivre,
            id: idSection,
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
    const { idLivre, idSection } = req.params;
    await Section.destroy({
    where: {
        id_livre: idLivre,
        id: idSection
    },
    });
    res.status(200).json({ message: "Section deleted" });
} catch (error) {
    res.status(500).json({ error: error.message });
}
};