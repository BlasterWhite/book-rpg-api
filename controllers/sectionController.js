const sequelize = require("../db/db");
const Resultat = require("../models/resultatModels");
const Section = require("../models/sectionModels");

exports.createSection = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const { idLivre } = req.params;
    const { numero_section, texte, id_image, type, resultat, destinations } = req.body;

    if(typeof numero_section === 'undefined' || typeof texte === 'undefined' || typeof id_image === 'undefined' || typeof type === 'undefined') {
      res.status(400).json({error: "Missing arguments for section"});
      return;
    }

    const section = await Section.create(
      { id_livre:Number(idLivre), numero_section, texte, id_image, type, resultat },
      {
        include: [
          {
            model: Resultat,
            as: 'resultats'
          }
        ],
        transaction
      },
    );

    if(type === "none" || type === "termine") {
      if(destinations && Array.isArray(destinations) && destinations.length > 0) {
        res.status(400).json({error: "Section type does not correspond to number of destination 1"});
        return;
      }
    } else if(type === "des" || type === "combat" || type === "enigme") {
      if(typeof resultat === 'undefined' && typeof destinations === 'undefined') {
        res.status(400).json({error: "Missing arguments for section"});
        return;
      }
      
      if(typeof resultat.condition === 'undefined' || typeof resultat.type_condition === 'undefined' || typeof resultat.gagne === 'undefined' || typeof resultat.perd === 'undefined') {
        res.status(400).json({error: "Missing arguments for resultat"});
        return;
      }

      if(destinations && Array.isArray(destinations) && destinations.length != 2) {
        res.status(400).json({error: "Section type does not correspond to number of destination 2"});
        return;
      }

      if(!destinations.includes(resultat.gagne) || !destinations.includes(resultat.perd)) {
        res.status(400).json({error: "resultat.gagne and resultat.perd must be in destination"});
        return;
      }

      if(section.id === resultat.gagne || section.id === resultat.perd || destinations.includes(section.id)) {
        res.status(400).json({error: "Section id must not be in destination or in resultat.gagne or in resultat.perd"});
        return;
      }

      for (const destination of destinations) {
        const search = await Section.findOne({
          where: {
              id_livre: idLivre,
              id: destination,
          },
          transaction
        });
        if (!search) {
            res.status(404).json({error: "Destination not found"});
        }
        section.addSections(search);
      }

      const sectionGagne = await Section.findByPk(resultat.gagne, {transaction});
      if(!sectionGagne) {
        res.status(404).json({error: "Destination gagne not found"});
        return;
      }

      const sectionPerd = await Section.findByPk(resultat.perd, {transaction});
      if(!sectionPerd) {
        res.status(404).json({error: "Destination perd not found"});
        return;
      }

      const resultatInsere = await Resultat.create({ 
        id_section: section.id, 
        condition: resultat.condition, 
        type_condition: resultat.type_condition, 
        gagne: resultat.gagne, 
        perd: resultat.perd 
      },
      {
        transaction
      });

    } else if(type === "choix") {
      if(typeof destinations === 'undefined') {
        res.status(400).json({error: "Missing arguments for section"});
        return;
      }
      
      if(destinations && Array.isArray(destinations) && destinations.length == 0) {
        res.status(400).json({error: "Section type does not correspond to number of destination 3"});
        return;
      }
      
      if(destinations.includes(section.id)) {
        res.status(400).json({error: "Section id must not be in destination"});
        return;
      }

      for (const destination of destinations) {
        const search = await Section.findOne({
          where: {
            id_livre: idLivre,
            id: destination,
          },
          transaction
        });
        if (!search) {
            res.status(404).json({error: "Destination not found"});
        }
        section.addSections(search);
      }
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
      ],
      transaction
    });
    
    await transaction.commit();
    res.status(201).json({message: sectionInseree});
  } catch (error) {
    console.error(error);
    if(transaction) {
      await transaction.rollback();
    }
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