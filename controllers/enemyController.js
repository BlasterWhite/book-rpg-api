const sequelize = require("../db/db");

const Enemy = require("../models/enemyModel");
const {Personnage} = require("../models/personnageModels");
const Section = require("../models/sectionModels");
const Image = require("../models/imageModels");

exports.getAllEnemy = async (req, res) => {
    try {
        if (req.user.permission !== "admin") return res.status(403).json({error: "Forbidden"});
        const enemy = await Enemy.findAll({
            include: [
                {
                    model: Personnage,
                    as: "personnage",
                },
                {
                    model: Section,
                    as: "section",
                },
            ],
        });
        res.status(200).json(enemy);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

exports.getOneEnemy = async (req, res) => {
    try {
        const {id} = req.params;
        const enemy = await Enemy.findOne({
            where: {
                id,
            },
            include: [
                {
                    model: Personnage,
                    as: "personnage",
                },
                {
                    model: Section,
                    as: "section",
                },
            ],
        });
        res.status(200).json(enemy);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

exports.createEnemy = async (req, res) => {
    try {
        const {id_section, personnage} = req.body;
        if (req.user.permission !== "admin") return res.status(403).json({error: "Forbidden"});
        if (!id_section) return res.status(400).json({error: "id_section is required"});
        if (!personnage) return res.status(400).json({error: "personnage is required"});

        const result = await sequelize.transaction(async (t) => {
            const section = await Section.findByPk(id_section, {transaction: t});
            if (!section) return {
                code: 404,
                error: "Section not found",
            }

            if (!personnage.nom) return {code: 400, error: "nom is required"};
            if (!personnage.description) return {code: 400, error: "description is required"};
            if (!personnage.occupation) return {code: 400, error: "occupation is required"};
            if (!personnage.apparence) return {code: 400, error: "apparence is required"};
            if (!personnage.dexterite) return {code: 400, error: "dexterite is required"};
            if (!personnage.endurance) return {code: 400, error: "endurance is required"};
            if (!personnage.psychisme) return {code: 400, error: "psychisme is required"};
            if (!personnage.force) return {code: 400, error: "force is required"};
            if (!personnage.resistance) return {code: 400, error: "resistance is required"};
            if (!personnage.id_image) return {code: 400, error: "id_image is required"};

            const [personnageImage, createdImagePersonnage] = await Image.findOrCreate({
                where: {
                    id: personnage.id_image,
                },
                defaults: {
                    image: "https://plus.unsplash.com/premium_vector-1689096617925-fa06e7b7a3a9?bg=FFFFFF&w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGVyc29ubmFnZXxlbnwwfHwwfHx8MA%3D%3D",
                },
                transaction: t,
            });

            const personnageInDB = await Personnage.create(
                {
                    nom: personnage.nom,
                    description: personnage.description,
                    occupation: personnage.occupation,
                    apparence: personnage.apparence,
                    dexterite: personnage.dexterite,
                    endurance: personnage.endurance,
                    psychisme: personnage.psychisme,
                    force: personnage.force,
                    resistance: personnage.resistance,
                    id_image: personnageImage.id,
                },
                {transaction: t},
            );

            return await Enemy.create(
                {
                    id_personnage: personnageInDB.id,
                    id_section,
                },
                {transaction: t},
            );
        });
        if (result.code) {
            res.status(result.code).json({error: result.error});
        } else {
            res.status(201).json(result);
        }
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

exports.updateEnemy = async (req, res) => {
    try {
        const {id} = req.params;
        const {id_section, personnage} = req.body;
        if (req.user.permission !== "admin") return res.status(403).json({error: "Forbidden"});
        const result = await sequelize.transaction(async (t) => {
            if (personnage) {
                const personnageInDB = await Personnage.findByPk(personnage.id, {transaction: t});
                if (!personnageInDB) return {
                    code: 404,
                    error: "Personnage not found",
                }
                const section = await Section.findByPk(id_section, {transaction: t});
                if (!section) return {
                    code: 404,
                    error: "Section not found",
                }

                if (personnage.nom) personnageInDB.nom = personnage.nom;
                if (personnage.description) personnageInDB.description = personnage.description;
                if (personnage.occupation) personnageInDB.occupation = personnage.occupation;
                if (personnage.apparence) personnageInDB.apparence = personnage.apparence;
                if (personnage.dexterite) personnageInDB.dexterite = personnage.dexterite;
                if (personnage.endurance) personnageInDB.endurance = personnage.endurance;
                if (personnage.psychisme) personnageInDB.psychisme = personnage.psychisme;
                if (personnage.force) personnageInDB.force = personnage.force;
                if (personnage.resistance) personnageInDB.resistance = personnage.resistance;
                if (personnage.id_image) {
                    const image = await Image.findByPk(personnage.id_image, {transaction: t});
                    if (!image) return {
                        code: 404,
                        error: "Image not found",
                    }
                    personnageInDB.id_image = personnage.id_image;
                }
                await personnageInDB.save({transaction: t});
            }

            const enemy = await Enemy.findByPk(id, {transaction: t});
            if (!enemy) return {
                code: 404,
                error: "Enemy not found",
            }
            if (id_section) enemy.id_section = id_section;
            if (personnage && personnage.id) enemy.id_personnage = personnage.id;
            await enemy.save({transaction: t});
            return enemy;
        });
        if (result.code) {
            res.status(result.code).json({error: result.error});
        } else {
            res.status(200).json({message: "Enemy updated"});
        }
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

exports.deleteEnemy = async (req, res) => {
    try {
        const {id} = req.params;
        if (req.user.permission !== "admin") return res.status(403).json({error: "Forbidden"});
        const result = await sequelize.transaction(async (t) => {
            const enemy = await Enemy.findByPk(id, {transaction: t});
            if (!enemy) {
                return {
                    code: 404,
                    error: "Enemy not found",
                }
            }
            return await Enemy.destroy({
                where: {
                    id,
                },
                transaction: t,
            });
        });
        if (result.code) {
            return res.status(result.code).json({error: result.error});
        }
        res.status(200).json({message: "Enemy deleted"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}