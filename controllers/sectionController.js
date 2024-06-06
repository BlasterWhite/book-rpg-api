const sequelize = require("../db/db");
const Resultat = require("../models/resultatModels");
const Section = require("../models/sectionModels");
const Image = require("../models/imageModels");
const Event = require("../models/eventModels");
const {Personnage} = require("../models/personnageModels");

exports.createSection = async (req, res) => {
    try {
        const {idLivre} = req.params;
        const {id_image} = req.body;

        const result = await sequelize.transaction(async (t) => {
            const id_imageIsUndefined = (typeof id_image === "undefined");

            if (id_imageIsUndefined) return {
                code: 400,
                error: "Missing arguments for section"
            }

            const [image, created] = await Image.findOrCreate({
                where: {
                    id: id_image,
                },
                defaults: {
                    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                },
                transaction: t,
            });

            const highestNumeroSection = await Section.max("numero_section", {
                where: {
                    id_livre: idLivre,
                },
                transaction: t,
            });
            const numero_section = highestNumeroSection + 1;
            const section = await Section.create(
                {
                    id_livre: Number(idLivre),
                    numero_section,
                    texte: "New Section",
                    id_image: image.id,
                    type: "none",
                },
                {
                    transaction: t,
                },
            );

            return await Section.findOne({
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
                transaction: t,
            });
        });
        if (result.error) {
            return res.status(result.code).json({error: result.error});
        }
        res.status(201).json({message: "Section created", section: result});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.getAllSections = async (req, res) => {
    try {
        const {idLivre} = req.params;
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
                        console.error(section.resultat.condition);
                    }
                }
            }
        });
        res.status(200).json(sections);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.getSectionById = async (req, res) => {
    try {
        const {idLivre, idSection} = req.params;
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
        res.status(500).json({error: error.message});
    }
};

exports.updateSection = async (req, res) => {
    try {
        const {idLivre, idSection} = req.params;
        const {
            texte,
            id_image,
            type,
            resultat,
            destinations,
            event,
        } = req.body;

        const result = await sequelize.transaction(async (t) => {
            const updatedSection = await Section.findOne({
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
                    }
                ],
                transaction: t,
            });

            if (!updatedSection) return {
                code: 404,
                error: "Section not found",
            }

            if (Array.isArray(destinations) && destinations.length > 0) {
                if (updatedSection.sections.length > 0) await updatedSection.setSections(null, {transaction: t});

                for (const destination of destinations) {
                    const search = await Section.findOne({
                        where: {
                            id_livre: idLivre,
                            id: destination,
                        },
                        transaction: t,
                    });
                    if (!search) return {
                        code: 404,
                        error: "Destination not found",
                    }
                    updatedSection.addSections(search, {transaction: t});
                }
            }

            if (type === "none") return {
                code: 400,
                error: "Type none is not allowed for update",
            }

            if (["des", "combat", "enigme"].includes(type)) {
                if (typeof resultat === "undefined") return {
                    code: 400,
                    error: `Type ${type} must have a resultat`,
                }

                const winType = (typeof resultat.gagne !== "number");
                const looseType = (typeof resultat.perd !== "number");
                if (winType || looseType) return {
                    code: 400,
                    error: "Type gagne and perd must be integer",
                }
            }

            switch (type) {
                case "des":
                    if (resultat.type_condition !== "JSON") return {
                        code: 400,
                        error: "Type condition must be JSON",
                    }

                    for (const key in resultat.condition) {
                        if (!Array.isArray(resultat.condition[key])) return {
                            code: 400,
                            error: "Type condition must be a list of integer",
                        }
                    }

                    if (updatedSection.resultat) await updatedSection.resultat.destroy({transaction: t});

                    resultat.id_section = updatedSection.id;
                    await updatedSection.createResultat({
                        id_section: updatedSection.id,
                        type_condition: resultat.type_condition,
                        condition: JSON.stringify(resultat.condition),
                        gagne: resultat.gagne,
                        perd: resultat.perd,
                    }, {transaction: t});
                    break
                case "enigme":
                    if (resultat.type_condition !== "text") return {
                        code: 400,
                        error: "Type condition must be text",
                    }

                    if (updatedSection.resultat) await updatedSection.resultat.destroy({transaction: t});

                    resultat.id_section = updatedSection.id;
                    await updatedSection.createResultat({
                        id_section: updatedSection.id,
                        type_condition: resultat.type_condition,
                        condition: resultat.condition.toString(),
                        gagne: resultat.gagne,
                        perd: resultat.perd,
                    }, {transaction: t});
                    break;
                case "combat":
                    if (resultat.type_condition !== "id") return {
                        code: 400,
                        error: "Type condition must be id to reference a personnage",
                    }

                    const enemyPersonnage = await Personnage.findByPk(resultat.condition, {transaction: t});
                    if (!enemyPersonnage) return {
                        code: 404,
                        error: "Enemy not found",
                    }

                    if (updatedSection.resultat) await updatedSection.resultat.destroy({transaction: t});

                    resultat.id_section = updatedSection.id;
                    await updatedSection.createResultat({
                        id_section: updatedSection.id,
                        type_condition: resultat.type_condition,
                        condition: resultat.condition,
                        gagne: resultat.gagne,
                        perd: resultat.perd,
                    }, {transaction: t});

                    break;
                case "termine":
                    await updatedSection.setSections(null, {transaction: t});
                    await updatedSection.setResultat(null, {transaction: t});
                    break;
            }

            if (event) await Event.destroy({
                where: {
                    id_section: idSection,
                },
                transaction: t,
            });

            for (const e of event) {
                const res = await Event.create(
                    {
                        id_section: idSection,
                        operation: e.operation,
                        which: e.which,
                        type: e.type,
                        value: e.value,
                    },
                    {transaction: t},
                );
                await updatedSection.addEvents(res, {transaction: t});
            }

            if (texte) updatedSection.texte = texte;
            if (type) updatedSection.type = type;

            if (id_image) {
                const image = await Image.findByPk(id_image, {transaction: t});
                if (!image) return {
                    code: 404,
                    error: "Image not found",
                }
                updatedSection.id_image = image.id;
            }

            return await updatedSection.save({transaction: t});
        });

        if (result.error) {
            return res.status(result.code).json({error: result.error});
        }
        res.status(200).json({message: "Section updated"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.deleteSection = async (req, res) => {
    try {
        const {idLivre, idSection} = req.params;
        const result = sequelize.transaction(async (t) => {
            const section = await Section.findOne({
                where: {
                    id_livre: idLivre,
                    id: idSection,
                },
                transaction: t,
            });
            if (!section) return {
                code: 404,
                error: "Section not found",
            }
            return await section.destroy({transaction: t});
        });
        if (result.error) {
            return res.status(result.code).json({error: result.error});
        }
        res.status(200).json({message: "Section deleted"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.createEvent = async (req, res) => {
    try {
        const {idLivre, idSection} = req.params;
        const {operation, which, type, value} = req.body

        const result = await sequelize.transaction(async (t) => {
            const operationType = (typeof operation === "undefined");
            const whichType = (typeof which === "undefined");
            const valueType = (typeof value === "undefined");

            if (operationType || whichType || valueType) return {
                code: 400,
                error: "Missing arguments for event",
            }

            const section = await Section.findOne({
                where: {
                    id_livre: idLivre,
                    id: idSection,
                },
                transaction: t,
            });

            if (!section) return {
                code: 404,
                error: "Section not found",
            }

            return await Event.create(
                {
                    id_section: section.id,
                    operation,
                    which,
                    type,
                    value,
                },
                {transaction: t},
            );
        });
        if (result.error) {
            return res.status(result.code).json({error: result.error});
        }
        res.status(201).json({message: "Event created"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const {idSection, idEvent} = req.params;
        const {operation, which, type, value} = req.body;

        const result = await sequelize.transaction(async (t) => {
            const updatedEvent = await Event.findOne({
                where: {
                    id_section: idSection,
                    id: idEvent,
                },
                transaction: t,
            });

            if (!updatedEvent) return {
                code: 404,
                error: "Event not found",
            }

            if (operation) updatedEvent.operation = operation;
            if (which) updatedEvent.which = which;
            if (type) updatedEvent.type = type;
            if (value) updatedEvent.value = value;

            return await updatedEvent.save({transaction: t});
        });

        if (result.error) {
            return res.status(result.code).json({error: result.error});
        }
        res.status(200).json({message: "Event updated"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const {idSection, idEvent} = req.params;
        const result = await sequelize.transaction(async (t) => {
            const event = await Event.findOne({
                where: {
                    id_section: idSection,
                    id: idEvent,
                },
                transaction: t,
            });
            if (!event) return {
                code: 404,
                error: "Event not found",
            }
            return await event.destroy({transaction: t});
        });
        if (result.error) {
            return res.status(result.code).json({error: result.error});
        }
        res.status(200).json({message: "Event deleted"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};
