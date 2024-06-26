const sequelize = require("../db/db");

const Image = require("../models/imageModels");
const Arme = require("../models/armeModels");

exports.getAllArme = async (req, res) => {
    try {
        const arme = await Arme.findAll({
            include: [
                {
                    model: Image,
                    as: "image",
                    attributes: ["image"],
                },
            ],
        });
        res.status(200).json(arme);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.getOneArme = async (req, res) => {
    try {
        const {id} = req.params;
        const arme = await Arme.findOne({
            where: {
                id,
            },
            include: [
                {
                    model: Image,
                    as: "image",
                    attributes: ["image"],
                },
            ],
        });
        res.status(200).json(arme);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.createArme = async (req, res) => {
    try {
        const {titre, description, id_image, degats, durabilite} = req.body;
        const result = await sequelize.transaction(async (t) => {
            const image = await Image.findByPk(id_image, {transaction: t});
            if (!image) {
                return {
                    code: 404,
                    error: "Image not found",
                }
            }
            return await Arme.create(
                {
                    titre,
                    description,
                    id_image,
                    degats,
                    durabilite,
                },
                {
                    transaction: t,
                },
            );
        });
        if (result.error) {
            return res.status(result.code).json({error: result.error});
        }
        res.status(201).json({message: "Arme created"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.updateArme = async (req, res) => {
    try {
        const {id} = req.params;
        const {titre, description, id_image, degats, durabilite} = req.body;
        const result = await sequelize.transaction(async (t) => {
            const arme = await Arme.findByPk(id, {transaction: t});
            if (!arme) return {
                code: 404,
                error: "Arme not found",
            }
            const image = await Image.findByPk(id_image, {transaction: t});
            if (!image) return {
                code: 404,
                error: "Image not found",
            }

            if (titre) arme.titre = titre;
            if (description) arme.description = description;
            if (degats) arme.degats = degats;
            if (durabilite) arme.durabilite = durabilite;
            if (id_image) {
                const image = await Image.findByPk(id_image, {transaction: t});
                if (!image) return {
                    code: 404,
                    error: "Image not found",
                }
                arme.id_image = id_image;
            }

            return await arme.save({transaction: t});
        });
        if (result.error) {
            return res.status(result.code).json({error: result.error});
        }
        res.status(200).json({message: "Arme updated"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.deleteArme = async (req, res) => {
    try {
        const {id} = req.params;
        const result = await sequelize.transaction(async (t) => {
            const arme = await Arme.findByPk(id, {transaction: t});
            if (!arme) return {
                code: 404,
                error: "Arme not found",
            }
            return await arme.destroy({transaction: t});
        });
        if (result.error) {
            return res.status(result.code).json({error: result.error});
        }
        res.status(200).json({message: "Arme deleted"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};
