const sequelize = require("../db/db");

const Enemy = require("../models/enemyModel");
const {Personnage} = require("../models/personnageModels");
const Section = require("../models/sectionModels");

exports.getAllEnemy = async (req, res) => {
    try {
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
        const {id_personnage, id_section} = req.body;
        const result = await sequelize.transaction(async (t) => {
            const personnage = await Personnage.findByPk(id_personnage, {transaction: t});
            if (!personnage) {
                return {
                    code: 404,
                    error: "Personnage not found",
                }
            }
            const section = await Section.findByPk(id_section, {transaction: t});
            if (!section) {
                return {
                    code: 404,
                    error: "Section not found",
                }
            }
            return await Enemy.create(
                {
                    id_personnage,
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
        const {id_personnage, id_section} = req.body;
        const result = await sequelize.transaction(async (t) => {
            const personnage = await Personnage.findByPk(id_personnage, {transaction: t});
            if (!personnage) {
                return {
                    code: 404,
                    error: "Personnage not found",
                }
            }
            const section = await Section.findByPk(id_section, {transaction: t});
            if (!section) {
                return {
                    code: 404,
                    error: "Section not found",
                }
            }
            return await Enemy.update(
                {
                    id_personnage,
                    id_section,
                },
                {
                    where: {
                        id,
                    },
                    transaction: t,
                },
            );
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