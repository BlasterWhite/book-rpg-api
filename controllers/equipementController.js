const sequelize = require("../db/db");

const Image = require("../models/imageModels");
const Equipement = require("../models/equipementModels");

exports.getAllEquipement = async (req, res) => {
    try {
        const equipement = await Equipement.findAll({
            include: [{
                model: Image, as: "image", attributes: ["image"],
            },],
        });
        res.status(200).json(equipement);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.getOneEquipement = async (req, res) => {
    try {
        const {id} = req.params;
        const equipement = await Equipement.findOne({
            where: {
                id,
            }, include: [{
                model: Image, as: "image", attributes: ["image"],
            },],
        });
        res.status(200).json(equipement);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.createEquipement = async (req, res) => {
    try {
        const {nom, description, id_image, resistance} = req.body;
        await sequelize.transaction(async (t) => {
            const [image, created] = await Image.findOrCreate({
                where: {
                    id: id_image,
                }, defaults: {
                    image: "https://picsum.photos/270/500",
                }, transaction: t,
            });

            return await Equipement.create({
                nom, description, id_image: image.id, resistance,
            }, {transaction: t});
        });
        res.status(201).json({message: "Equipement created"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.updateEquipement = async (req, res) => {
    try {
        const {id} = req.params;
        const {nom, description, id_image, resistance} = req.body;
        const result = await sequelize.transaction(async (t) => {
            const equipement = await Equipement.findByPk(id, {transaction: t});
            if (!equipement) {
                return {
                    code: 404, error: "Equipement not found",
                }
            }
            if (nom) equipement.nom = nom;
            if (description) equipement.description = description;
            if (resistance) equipement.resistance = resistance;
            if (id_image) {
                const image = await Image.findByPk(id_image, {transaction: t});
                if (!image) return {
                    code: 404, error: "Image not found",
                }
                equipement.id_image = image.id;
            }
            return await equipement.save({transaction: t});
        });
        if (result.error) {
            return res.status(result.code).json({error: result.error});
        }
        res.status(200).json({message: "Equipement updated"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.deleteEquipement = async (req, res) => {
    try {
        const {id} = req.params;
        const result = await sequelize.transaction(async (t) => {
            const equipement = await Equipement.findByPk(id, {transaction: t});
            if (!equipement) return {
                code: 404, error: "Equipement not found",
            }
            return await equipement.destroy({transaction: t});
        });
        if (result.error) {
            return res.status(result.code).json({error: result.error});
        }
        res.status(200).json({message: "Equipement deleted"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};
