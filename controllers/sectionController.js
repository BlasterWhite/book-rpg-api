const sequelize = require("../db/db");
const Resultat = require("../models/resultatModels");
const Section = require("../models/sectionModels");
const Image = require("../models/imageModels");
const Event = require("../models/eventModels");

exports.createSection = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const { idLivre } = req.params;
    const { numero_section, texte, id_image, type, resultat, destinations } =
      req.body;

    let image = await Image.findByPk(id_image);
    if (!image) {
      image = await Image.create({
        image: "https://picsum.photos/270/500",
      });
    }

    if (
      typeof numero_section === "undefined" ||
      typeof texte === "undefined" ||
      typeof id_image === "undefined" ||
      typeof type === "undefined"
    ) {
      res.status(400).json({ error: "Missing arguments for section" });
      return;
    }

    const section = await Section.create(
      {
        id_livre: Number(idLivre),
        numero_section,
        texte,
        id_image: image.id,
        type,
        resultat,
      },
      {
        include: [
          {
            model: Resultat,
            as: "resultat",
          },
        ],
        transaction,
      },
    );

    if (type === "none" || type === "termine") {
      if (
        destinations &&
        Array.isArray(destinations) &&
        destinations.length > 0
      ) {
        res.status(400).json({
          error: "Section type does not correspond to number of destination",
        });
        return;
      }
    } else if (type === "des" || type === "combat" || type === "enigme") {
      if (
        typeof resultat === "undefined" &&
        typeof destinations === "undefined"
      ) {
        res.status(400).json({ error: "Missing arguments for section" });
        return;
      }

      if (
        typeof resultat.condition === "undefined" ||
        typeof resultat.type_condition === "undefined" ||
        typeof resultat.gagne === "undefined" ||
        typeof resultat.perd === "undefined"
      ) {
        res.status(400).json({ error: "Missing arguments for resultat" });
        return;
      }

      if (
        destinations &&
        Array.isArray(destinations) &&
        destinations.length !== 2
      ) {
        res.status(400).json({
          error: "Section type does not correspond to number of destination",
        });
        return;
      }

      if (
        !destinations.includes(resultat.gagne) ||
        !destinations.includes(resultat.perd)
      ) {
        res.status(400).json({
          error: "resultat.gagne and resultat.perd must be in destination",
        });
        return;
      }

      if (
        section.id === resultat.gagne ||
        section.id === resultat.perd ||
        destinations.includes(section.id)
      ) {
        res.status(400).json({
          error:
            "Section id must not be in destination or in resultat.gagne or in resultat.perd",
        });
        return;
      }

      for (const destination of destinations) {
        const search = await Section.findOne({
          where: {
            id_livre: idLivre,
            id: destination,
          },
          transaction,
        });
        if (!search) {
          res.status(404).json({ error: "Destination not found" });
        }
        section.addSections(search);
      }

      const sectionGagne = await Section.findByPk(resultat.gagne, {
        transaction,
      });
      if (!sectionGagne) {
        res.status(404).json({ error: "Destination gagne not found" });
        return;
      }

      const sectionPerd = await Section.findByPk(resultat.perd, {
        transaction,
      });
      if (!sectionPerd) {
        res.status(404).json({ error: "Destination perd not found" });
        return;
      }
    } else if (type === "choix") {
      if (typeof destinations === "undefined") {
        res.status(400).json({ error: "Missing arguments for section" });
        return;
      }

      if (
        destinations &&
        Array.isArray(destinations) &&
        destinations.length === 0
      ) {
        res.status(400).json({
          error: "Section type does not correspond to number of destination",
        });
        return;
      }

      if (destinations.includes(section.id)) {
        res
          .status(400)
          .json({ error: "Section id must not be in destination" });
        return;
      }

      for (const destination of destinations) {
        const search = await Section.findOne({
          where: {
            id_livre: idLivre,
            id: destination,
          },
          transaction,
        });
        if (!search) {
          res.status(404).json({ error: "Destination not found" });
        }
        section.addSections(search);
      }
    } else {
      res.status(400).json({ error: "Wrong type" });
      return;
    }

    await transaction.commit();

    transaction = await sequelize.transaction();

    const sectionInseree = await Section.findOne({
      where: {
        id_livre: idLivre,
        id: section.id,
      },
      include: [
        {
          model: Resultat,
          as: "resultat",
        },
        {
          model: Section,
          as: "sections",
          through: "association_liaison_section",
          foreignKey: "id_section_source",
          otherKey: "id_section_destination",
        },
        {
          model: Event,
          as: "events",
        },
      ],
      transaction,
    });

    await transaction.commit();
    res.status(201).json({ message: sectionInseree });
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    res.status(500).json({ error: error.message });
  }
};

exports.getAllSections = async (req, res) => {
  try {
    const { idLivre } = req.params;
    const sections = await Section.findAll({
      attributes: [
        "id",
        "id_livre",
        "numero_section",
        "texte",
        "id_image",
        "type",
      ],
      where: {
        id_livre: idLivre,
      },
      include: [
        {
          model: Resultat,
          as: "resultat",
        },
        {
          model: Section,
          as: "sections",
          through: "association_liaison_section",
          foreignKey: "id_section_source",
          otherKey: "id_section_destination",
        },
        {
          model: Image,
          as: "image",
        },
        {
          model: Event,
          as: "events",
        },
      ],
    });
    sections.forEach((section) => {
      if (section.resultat) {
        if (section.resultat.type_condition === "JSON") {
          try {
            section.resultat.condition = JSON.parse(section.resultat.condition);
          } catch (error) {
            console.log(section.resultat.condition);
          }
        }
      }
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
        id: idSection,
      },
      include: [
        {
          model: Resultat,
          as: "resultat",
        },
        {
          model: Section,
          as: "sections",
          through: "association_liaison_section",
          foreignKey: "id_section_source",
          otherKey: "id_section_destination",
        },
        {
          model: Image,
          as: "image",
        },
        {
          model: Event,
          as: "events",
        },
      ],
    });
    if (section.resultat) {
      if (section.resultat.type_condition === "JSON") {
        section.resultat.condition = JSON.parse(section.resultat.condition);
      }
    }
    res.status(200).json(section);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSection = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const { idLivre, idSection } = req.params;
    const { numero_section, texte, id_image, type, resultat, destinations } =
      req.body;

    const updatedSection = await Section.findOne({
      where: {
        id_livre: idLivre,
        id: idSection,
      },
      include: [{ model: Resultat, as: "resultat" }],
      transaction,
    });

    if (Array.isArray(destinations)) {
      if (destinations.length > 0) {
        const nbDestinations = await updatedSection.getSections();
        if (nbDestinations.length > 0) {
          await updatedSection.setSections(null);
        }

        for (const destination of destinations) {
          const search = await Section.findOne({
            where: {
              id_livre: idLivre,
              id: destination,
            },
            transaction,
          });
          if (search === null) {
            res.status(404).json({ error: "Destination not found" });
          }
          updatedSection.addSections(search);
        }
      }
    }
    let queryRes;
    switch (type) {
      case "none":
        res.status(400).json({ error: "Type none is not allowed for update" });
        break;
      case "des":
        if (typeof resultat === "undefined") {
          res.status(400).json({ error: "Type choix must not have resultat" });
        }

        if (resultat.type_condition !== "JSON") {
          res.status(400).json({ error: "Type condition must be JSON" });
          return;
        }

        for (const key in resultat.condition) {
          if (!Array.isArray(resultat.condition[key])) {
            res
              .status(400)
              .json({ error: "Type condition must be a list of integer" });
            return;
          }
        }

        if (
          typeof resultat.gagne !== "number" ||
          typeof resultat.perd !== "number"
        ) {
          res
            .status(400)
            .json({ error: "Type gagne and perd must be integer" });
          return;
        }

        queryRes = await updatedSection.getResultat(); // Trouvez le résultat associé
        if (queryRes) {
          await queryRes.destroy(); // Supprimez le résultat s'il existe
        }

        resultat.id_section = updatedSection.id;
        await updatedSection.createResultat({
          id_section: updatedSection.id,
          type_condition: resultat.type_condition,
          condition: JSON.stringify(resultat.condition),
          gagne: resultat.gagne,
          perd: resultat.perd,
        });
        break;
      case "enigme":
        // on vérifie si resultat est défini
        if (typeof resultat === "undefined") {
          res.status(400).json({ error: "Type choix must not have resultat" });
        }

        if (resultat.type_condition !== "text") {
          res.status(400).json({ error: "Type condition must be text" });
          return;
        }

        if (
          typeof resultat.gagne !== "number" ||
          typeof resultat.perd !== "number"
        ) {
          res
            .status(400)
            .json({ error: "Type gagne and perd must be integer" });
          return;
        }

        queryRes = await updatedSection.getResultat(); // Trouvez le résultat associé
        if (queryRes) {
          await queryRes.destroy(); // Supprimez le résultat s'il existe
        }

        resultat.id_section = updatedSection.id;
        await updatedSection.createResultat({
          id_section: updatedSection.id,
          type_condition: resultat.type_condition,
          condition: resultat.condition.toString(),
          gagne: resultat.gagne,
          perd: resultat.perd,
        });
        break;
      case "combat":
        if (typeof resultat === "undefined") {
          res.status(400).json({ error: "Type choix must not have resultat" });
        }

        if (typeof resultat.type_condition !== "number") {
          res.status(400).json({ error: "Type condition must be integer" });
          return;
        }

        const personnageAttributs = [
          "force",
          "dexterite",
          "endurance",
          "psychisme",
          "resistance",
        ];
        // on verifie que la condition soit égàlé à un des attributs
        if (!personnageAttributs.includes(resultat.condition.toLowerCase())) {
          res
            .status(400)
            .json({ error: "Type condition must be in personnage attributs" });
          return;
        }
        resultat.condition = resultat.condition.toLowerCase();

        if (
          typeof resultat.gagne !== "number" ||
          typeof resultat.perd !== "number"
        ) {
          res
            .status(400)
            .json({ error: "Type gagne and perd must be integer" });
          return;
        }

        queryRes = await updatedSection.getResultat();
        if (queryRes) {
          await queryRes.destroy();
        }

        resultat.id_section = updatedSection.id;
        await updatedSection.createResultat({
          id_section: updatedSection.id,
          type_condition: resultat.type_condition,
          condition: resultat.condition.toString(),
          gagne: resultat.gagne,
          perd: resultat.perd,
        });

        break;
      case "termine":
        await updatedSection.setSections(null);
        await updatedSection.setResultat(null);
        break;
    }

    await updatedSection.update(
      {
        numero_section,
        texte,
        id_image,
        type,
      },
      { transaction },
    );

    await transaction.commit();
    res.status(200).json({ message: "Section updated" });
  } catch (error) {
    if (transaction) await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

exports.deleteSection = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const { idLivre, idSection } = req.params;

    await Section.destroy({
      where: {
        id_livre: idLivre,
        id: idSection,
      },
      include: [
        {
          model: Resultat,
          as: "resultat",
        },
        {
          model: Section,
          as: "sections",
          through: "association_liaison_section",
          foreignKey: "id_section_source",
          otherKey: "id_section_destination",
        },
        {
          model: Event,
          as: "events",
        },
      ],
      transaction,
    });

    await transaction.commit();
    res.status(200).json({ message: "Section deleted" });
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    res.status(500).json({ error: error.message });
  }
};

exports.createEvent = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const { idLivre, idSection } = req.params;
    const { operation, which, type, value } = req.body;

    if (
      typeof operation === "undefined" ||
      typeof which === "undefined" ||
      typeof value === "undefined"
    ) {
      res.status(400).json({ error: "Missing arguments for event" });
      return;
    }

    const section = await Section.findOne({
      where: {
        id_livre: idLivre,
        id: idSection,
      },
      transaction,
    });

    if (!section) {
      res.status(404).json({ error: "Section not found" });
      return;
    }

    await Event.create(
      {
        id_section: section.id,
        operation,
        which,
        type,
        value,
      },
      { transaction },
    );

    await transaction.commit();
    res.status(201).json({ message: "Event created" });
  } catch (error) {
    if (transaction) await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const { idSection, idEvent } = req.params;
    const { operation, which, type, value } = req.body;

    const updatedEvent = await Event.findOne({
      where: {
        id_section: idSection,
        id: idEvent,
      },
      transaction,
    });

    if (!updatedEvent) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    if (operation) updatedEvent.operation = operation;
    if (which) updatedEvent.which = which;
    if (type) updatedEvent.type = type;
    if (value) updatedEvent.value = value;

    await updatedEvent.save({ transaction });
    await transaction.commit();
    res.status(200).json({ message: "Event updated" });
  } catch (error) {
    if (transaction) await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const { idSection, idEvent } = req.params;

    await Event.destroy({
      where: {
        id_section: idSection,
        id: idEvent,
      },
      transaction,
    });

    await transaction.commit();
    res.status(200).json({ message: "Event deleted" });
  } catch (error) {
    if (transaction) await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};
