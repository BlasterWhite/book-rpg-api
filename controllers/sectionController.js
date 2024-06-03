const sequelize = require("../db/db");
const Resultat = require("../models/resultatModels");
const Section = require("../models/sectionModels");
const Image = require("../models/imageModels");
const Event = require("../models/eventModels");
const {Personnage} = require("../models/personnageModels");

exports.createSection = async (req, res) => {
    try {
        const {idLivre} = req.params;
        const {numero_section, texte, id_image, type, resultat, destinations} = req.body;

        const result = await sequelize.transaction(async (t) => {
            const [image, created] = await Image.findOrCreate({
                where: {
                    id: id_image,
                },
                defaults: {
                    image: "https://picsum.photos/270/500",
                },
                transaction: t,
            });

            const numero_sectionIsUndefined = (typeof numero_section === "undefined");
            const texteIsUndefined = (typeof texte === "undefined");
            const id_imageIsUndefined = (typeof id_image === "undefined");
            const typeIsUndefined = (typeof type === "undefined");

            if (numero_sectionIsUndefined || texteIsUndefined || id_imageIsUndefined || typeIsUndefined) {
                return {
                    code: 400,
                    error: "Missing arguments for section"
                }
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
                    transaction: t,
                },
            );

            if (type === "none" || type === "termine") {
                if (!destinations || !Array.isArray(destinations) || destinations.length > 0) return {
                    code: 400,
                    error: "Destination must be a list of section id ! "
                }
            } else if (type === "des" || type === "combat" || type === "enigme") {
                if (typeof resultat === "undefined" && typeof destinations === "undefined") {
                    return {
                        code: 400,
                        error: "Missing arguments for section"
                    }
                }

                const conditionIsUndefined = (typeof resultat.condition === "undefined");
                const typeConditionIsUndefined = (typeof resultat.type_condition === "undefined");
                const gagneIsUndefined = (typeof resultat.gagne === "undefined");
                const perdIsUndefined = (typeof resultat.perd === "undefined");

                if (conditionIsUndefined || typeConditionIsUndefined || gagneIsUndefined || perdIsUndefined) {
                    return {
                        code: 400,
                        error: "Missing arguments for resultat"
                    }
                }


                if (!destinations || !Array.isArray(destinations) || destinations.length !== 2) return {
                    code: 400,
                    error: "Destination must be a list of section id equals to 2 ! "
                }

                if (!destinations.includes(resultat.gagne) || !destinations.includes(resultat.perd)) {
                    return {
                        code: 400,
                        error: "resultat.gagne and resultat.perd must be in destination"
                    }
                }

                if ((section.id === resultat.gagne) || (section.id === resultat.perd) || destinations.includes(section.id)) {
                    return {
                        code: 400,
                        error: "Section id must not be in destination or in resultat.gagne or in resultat.perd"
                    }
                }

                for (const destination of destinations) {
                    const search = await Section.findOne({
                        where: {
                            id_livre: idLivre,
                            id: destination,
                        },
                        transaction: t,
                    });
                    if (!search) {
                        return {
                            code: 400,
                            error: "Destination not found"
                        }
                    }
                    section.addSections(search, {transaction: t});
                }

                const sectionGagne = await Section.findByPk(resultat.gagne, {transaction: t});
                if (!sectionGagne) return {
                    code: 404,
                    error: "Destination gagne not found"
                }

                const sectionPerd = await Section.findByPk(resultat.perd, {transaction: t});
                if (!sectionPerd) return {
                    code: 404,
                    error: "Destination perd not found"
                }
            } else if (type === "choix") {
                if (typeof destinations === "undefined") return {
                    code: 400,
                    error: "Missing arguments for section"
                }

                if (!destinations || !Array.isArray(destinations) || destinations.length === 0) return {
                    code: 400,
                    error: "Destination must be a list of section id !"
                }

                if (destinations.includes(section.id)) return {
                    code: 400,
                    error: "Section id must not be in destination"
                }

                for (const destination of destinations) {
                    const search = await Section.findOne({
                        where: {
                            id_livre: idLivre,
                            id: destination,
                        },
                        transaction: t,
                    });
                    if (!search) {
                        return {
                            code: 404,
                            error: "Destination not found"
                        }
                    }
                    section.addSections(search, {transaction: t});
                }
            } else {
                return {
                    code: 400,
                    error: "Wrong type",
                }
            }

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
            return res.status(result.code).json(result.error);
        }
        res.status(201).json({message: "Section created", section: result});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.getAllSections = async (req, res) => {
    let transaction;
    try {
        const {idLivre} = req.params;
        transaction = await sequelize.transaction();
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
            transaction
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
        await transaction.commit();
        res.status(200).json(sections);
    } catch (error) {
        if (transaction) await transaction.rollback();
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
            numero_section,
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
                    if (typeof resultat.type_condition !== "number") return {
                        code: 400,
                        error: "Type condition must be integer",
                    }

                    resultat.condition = resultat.condition.toLowerCase();
                    if (!Personnage.ALL_ATTRIBUTS.includes(resultat.condition)) return {
                        code: 400,
                        error: "Type condition must be in personnage attributs",
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

            if (numero_section) updatedSection.numero_section = numero_section;
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
            return res.status(result.code).json(result.error);
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
            return res.status(result.code).json({error: result.message});
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
                message: "Missing arguments for event",
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
                message: "Section not found",
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
            return res.status(result.code).json({error: result.message});
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
                message: "Event not found",
            }

            if (operation) updatedEvent.operation = operation;
            if (which) updatedEvent.which = which;
            if (type) updatedEvent.type = type;
            if (value) updatedEvent.value = value;

            return await updatedEvent.save({transaction: t});
        });

        if (result.error) {
            return res.status(result.code).json({error: result.message});
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
                message: "Event not found",
            }
            return await event.destroy({transaction: t});
        });
        if (result.error) {
            return res.status(result.code).json({error: result.message});
        }
        res.status(200).json({message: "Event deleted"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};
