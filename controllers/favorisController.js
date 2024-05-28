const Favoris = require("../models/favorisModels");
const sequelize = require("../db/db");
const User = require("../models/userModels");
const Livre = require("../models/livreModels");

exports.getAllFavoris = async (req, res) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const idUser = req.user.id;
        const favoris = await Favoris.findAll({
            where: {
                id_utilisateur: idUser,
            },
            transaction,
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
        await transaction.commit();
        res.status(200).json(favoris);
    } catch (error) {
        if (transaction) await transaction.rollback();
        res.status(500).json({error: error.message});
    }
};

exports.getFavorisByLivre = async (req, res) => {
    let transaction;
    try {
        const idUser = req.user.id;
        const {idLivre} = req.params;
        transaction = await sequelize.transaction();
        const favoris = await Favoris.findAll({
            where: {
                id_livre: idLivre,
                id_utilisateur: idUser,
            },
            transaction,
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
        await transaction.commit();
        res.status(200).json(favoris);
    } catch (error) {
        if (transaction) await transaction.rollback();
        res.status(500).json({error: error.message});
    }
};

exports.createFavoris = async (req, res) => {
    let transaction;
    try {
        const idUser = req.user.id;
        const {id_livre} = req.body;
        transaction = await sequelize.transaction();
        const favoris = await Favoris.create({
            id_utilisateur: idUser,
            id_livre: id_livre
        }, {transaction});
        await transaction.commit();
        res.status(201).json(favoris);
    } catch (error) {
        if (transaction) await transaction.rollback();
        res.status(500).json({error: error.message});
    }
};

exports.updateFavoris = async (req, res) => {
    let transaction;
    try {
        const idUser = req.user.id;
        const {id_livre} = req.body;
        transaction = await sequelize.transaction();
        const favoris = await Favoris.findByPk(req.params.id, {transaction});
        await favoris.update(
            {
                id_utilisateur: idUser,
                id_livre,
            },
            {transaction},
        );
        await transaction.commit();
        res.status(200).json(favoris);
    } catch (error) {
        if (transaction) await transaction.rollback();
        res.status(500).json({error: error.message});
    }
};

exports.deleteFavoris = async (req, res) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const idUser = req.user.id;
        const {idLivre} = req.params;
        await Favoris.destroy({
            where: {
                id_utilisateur: idUser,
                id_livre: idLivre,
            },
            transaction,
        });
        await transaction.commit();
        res
            .status(204)
            .json({message: `Favoris for book ${idLivre} deleted`});
    } catch (error) {
        if (transaction) await transaction.rollback();
        res.status(500).json({error: error.message});
    }
};
