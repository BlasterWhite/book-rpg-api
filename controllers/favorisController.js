const Favoris = require("../models/favorisModels");
const sequelize = require("../db/db");
const Livre = require("../models/livreModels");
const Image = require("../models/imageModels");

exports.getAllFavoris = async (req, res) => {
    try {
        const idUser = req.user.id;
        const favoris = await Favoris.findAll({
            where: {
                id_utilisateur: idUser,
            },
            include: [
                {
                    model: Livre,
                    as: "livre",
                    include: [
                        {
                            model: Image,
                            as: "image",
                        }
                    ]
                },
            ],
        });
        res.status(200).json(favoris);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.createFavoris = async (req, res) => {
    try {
        const idUser = req.user.id;
        const {id_livre} = req.body;
        await sequelize.transaction(async (t) => {
            return await Favoris.create({
                id_utilisateur: idUser,
                id_livre,
            }, {transaction: t});
        });
        res.status(201).json({message: "Favoris created"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.deleteFavoris = async (req, res) => {
    try {
        const idUser = req.user.id;
        const {idLivre} = req.params;
        const result = await sequelize.transaction(async (t) => {
            const favoris = await Favoris.destroy({
                where: {
                    id_utilisateur: idUser,
                    id_livre: idLivre,
                },
                transaction: t,
            });
            if (!favoris) {
                return {
                    code: 404,
                    message: "Favoris not found",
                }
            }
            return favoris;
        });
        if (result.error) {
            return res.status(result.code).json({error: result.message});
        }
        res.status(200).json({message: `Favoris for book ${idLivre} deleted`});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};
