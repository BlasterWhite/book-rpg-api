const Resultat = require("../models/resultatModels");
const Section = require("../models/sectionModels");

exports.createSection = async (req, res) => {
  try {
    const { idLivre } = req.params;
    const { numero_section, texte, id_image, type, resultat, destinations } = req.body;

    if(Array.isArray(destinations) && destinations.length > 1) {
      if(type === "choix") {
      }
    } else if(Array.isArray(destinations) && destinations.length == 2) {
      if(type === "des" || type === "enigme" || type === "combat") {

      }
    } else if(!Array.isArray(destinations) || Array.isArray(destinations) && destinations.length == 0) {
      if(type === "none") {
        const section = await Section.create(
          { id_livre:Number(idLivre), numero_section, texte, id_image, type, resultat },
          {
            include: [
              {
                model: Resultat,
                as: 'resultats'
              }
            ]
          }
        );
      }
    }

    if(type === "des" || type === "enigme" || type === "combat") {
      
      const sectionGagne = await Section.findByPk(resultat.gagne);
      const sectionPerd = await Section.findByPk(resultat.perd);

      const resultatInsere = await Resultat.create({ id_section: section.id, condition: resultat.condition, type_condition: resultat.type_condition, gagne: resultat.gagne, perd: resultat.perd });
    }

    const sectionInseree = await Section.findOne({
      where: {
        id_livre: idLivre,
        id: section.id
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
    res.status(201).json(sectionInseree);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllSections = async (req, res) => {
  try {
    const { idLivre } = req.params;
    const sections = await Section.findAll({
      attributes: ["id", "id_livre", "numero_section", "texte", "id_image", "type"],
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