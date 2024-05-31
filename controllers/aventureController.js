const sequelize = require("../db/db");

const Aventure = require("../models/aventureModels");
const Livre = require("../models/livreModels");
const Section = require("../models/sectionModels");
const Image = require("../models/imageModels");
const Arme = require("../models/armeModels");
const {Personnage} = require("../models/personnageModels");

exports.createAventure = async (req, res) => {
    try {
        const {id_utilisateur, id_livre} = req.body;
        const result = await sequelize.transaction(async (t) => {
            if (id_utilisateur == null) {
                return {
                    error: "id_utilisateur is required",
                    code: 400,
                };
            }

            if (id_livre == null) {
                return {
                    error: "id_livre is required",
                    code: 400,
                };
            }

            const livre = await Livre.findByPk(id_livre, {transaction: t});
            if (!livre) {
                return {
                    error: "id_livre not found",
                    code: 404,
                };
            }

            const section = await Section.findOne({
                where: {
                    id_livre,
                    numero_section: 1,
                },
                transaction: t
            });
            if (!section) {
                return {
                    error: "Section 1 for not found",
                    code: 404,
                };
            }

            const id_personnage = livre.id_personnage_default;
            const personnage = await Personnage.findByPk(id_personnage, {transaction: t});
            if (!personnage) {
                return {
                    error: "id_personnage not found",
                    code: 404,
                };
            }

            const personnageCreated = await Personnage.create({
                nom: personnage.nom,
                apparence: personnage.apparence,
                occupation: personnage.occupation,
                description: personnage.description,
                id_image: personnage.id_image,
                id_livre: personnage.id_livre,
                dexterite: personnage.dexterite,
                force: personnage.force,
                endurance: personnage.endurance,
                psychisme: personnage.psychisme,
                resistance: personnage.resistance,
                id_personnage_default: personnage.id_personnage_default,
            }, {transaction: t});


            const image = await Image.findOne(
                {
                    where: {
                        image:
                            "data:image/png;base64,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",
                    },
                    transaction: t
                },
            );
            const [armeParDefault, created] = await Arme.findOrCreate({
                where: {
                    titre: "Poing",
                },
                defaults: {
                    titre: "Poing",
                    description: "L'armes la plus vieille du monde !",
                    id_image: image.id,
                    degats: 2,
                    durabilite: -1,
                },
                transaction: t
            });
            await personnageCreated.addArme(armeParDefault, {transaction: t});
            return await Aventure.create({
                id_utilisateur: id_utilisateur,
                id_livre: id_livre,
                id_section_actuelle: section.id,
                id_personnage: personnageCreated.id,
                statut: "en cours",
            }, {transaction: t});
        });
        if (result.error) {
            return res.status(result.code).json({error: result.error});
        }
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({error: error.message, stack: error.stack});
    }
};

exports.getAllAventure = async (req, res) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const aventure = await Aventure.findAll({transaction});
        await transaction.commit();
        res.status(200).json(aventure);
    } catch (error) {
        if (transaction) await transaction.rollback();
        res.status(500).json({error: error.message});
    }
};

exports.getOneAventure = async (req, res) => {
    let transaction;
    try {
        const {id} = req.params;
        transaction = await sequelize.transaction();
        const aventure = await Aventure.findByPk(id, {transaction});
        await transaction.commit();
        res.status(200).json(aventure);
    } catch (error) {
        if (transaction) await transaction.rollback();
        res.status(500).json({error: error.message});
    }
};

exports.updateAventure = async (req, res) => {
    let transaction;
    try {
        const {id} = req.params;
        const {
            id_section_actuelle,
            statut,
        } = req.body;
        transaction = await sequelize.transaction();

        await Aventure.update(
            {id_section_actuelle, statut},
            {
                where: {
                    id,
                },
                transaction
            },
        );
        await transaction.commit();
        res.status(200).json({message: "Aventure updated"});
    } catch (error) {
        if (transaction) await transaction.rollback();
        res.status(500).json({error: error.message});
    }
};

exports.deleteAventure = async (req, res) => {
    let transaction;
    try {
        const {id} = req.params;
        transaction = await sequelize.transaction();
        await Aventure.destroy({
            where: {
                id,
            },
            transaction
        });
        await transaction.commit();
        res.status(200).json({message: "Aventure deleted"});
    } catch (error) {
        if (transaction) await transaction.rollback();
        res.status(500).json({error: error.message});
    }
};

exports.getAllMostAventure = async (req, res) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const aventures = await Aventure.findAll({
            attributes: ["id_livre", [sequelize.fn("COUNT", sequelize.literal("DISTINCT id_utilisateur")), "id_utilisateur"]],
            group: ["id_livre"],
            order: [[sequelize.fn("COUNT", sequelize.literal("DISTINCT id_utilisateur")), "DESC"]],
            limit: 10,
            transaction
        });
        await transaction.commit();
        res.status(200).json(aventures);
    } catch (error) {
        if (transaction) await transaction.rollback();
        res.status(500).json({error: error.message});
    }
}
