const Livre = require("../models/livreModels");
const Image = require("../models/imageModels");
const sequelize = require("../db/db");

exports.createLivre = async (req, res) => {
    let transaction;
    try {
        const {titre, resume, id_image, tag, date_sortie} = req.body;
        transaction = await sequelize.transaction();
        let image;
        if (id_image) {
            image = await Image.findByPk(id_image, {
                transaction,
            });
        }
        if (!image) {
            image = await Image.create(
                {
                    image: "https://picsum.photos/270/500",
                },
                {transaction},
            );
        }
        const livre = await Livre.create(
            {
                titre,
                resume,
                id_image: image.id,
                tag,
                date_sortie,
            },
            {transaction},
        );
        await transaction.commit();
        res.status(201).json(livre);
    } catch (error) {
        if (transaction) await transaction.rollback();
        res.status(500).json({error: error.message});
    }
};

exports.getAllLivres = async (req, res) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const livres = await Livre.findAll({
            attributes: ["id", "titre", "resume", "id_image", "tag", "date_sortie"],
            include: [
                {
                    model: Image,
                    as: "image",
                    attributes: ["image"],
                },
            ],
            transaction,
        });
        await transaction.commit();
        res.status(200).json(livres);
    } catch (error) {
        if (transaction) await transaction.rollback();
        res.status(500).json({error: error.message});
    }
};

exports.getLivreById = async (req, res) => {
    let transaction;
    try {
        const {id} = req.params;
        transaction = await sequelize.transaction();
        const livre = await Livre.findByPk(id, {
            include: [
                {
                    model: Image,
                    as: "image",
                    attributes: ["image"],
                },
            ],
            transaction
        });
        if (!livre) {
            res.status(404).json({message: "Book not found"});
            return;
        }
        await transaction.commit();
        res.status(200).json(livre);
    } catch (error) {
        if (transaction) await transaction.rollback();
        res.status(500).json({error: error.message});
    }
};

exports.updateLivre = async (req, res) => {
    let transaction;
    try {
        const {id} = req.params;
        const {titre, resume, id_image, tag, date_sortie} = req.body;
        transaction = await sequelize.transaction();
        // on check si le livre existe
        const livreExist = await Livre.findByPk(id, {transaction});
        if (!livreExist) {
            res.status(404).json({message: "Book not found"});
            return;
        }
        const livre = await Livre.update(
            {titre, resume, tag, date_sortie},
            {
                where: {
                    id,
                },
            },
            transaction
        );
        if (id_image) {
            await Image.update(
                {image: id_image},
                {
                    where: {
                        id: livre.id_image,
                    },
                },
                transaction
            );
        }
        await transaction.commit();
        res.status(200).json({message: "Book updated"});
    } catch (error) {
        if (transaction) await transaction.rollback();
        res.status(500).json({error: error.message});
    }
};

exports.deleteLivre = async (req, res) => {
    try {
        const {id} = req.params;
        await Livre.destroy({
            where: {
                id,
            },
        });
        res.status(200).json({message: "Book deleted"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.getAllNewLivres = async (req, res) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const livres = await Livre.findAll({
            order: [["date_sortie", "DESC"]],
            include: [
                {
                    model: Image,
                    as: "image",
                    attributes: ["image"],
                },
            ],
            limit: 10,
            transaction
        });
        await transaction.commit();
        res.status(200).json(livres);
    } catch (error) {
        if (transaction) await transaction.rollback();
        res.status(500).json({error: error.message});
    }
};

exports.getAllPopularLivres = async (req, res) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const livres = await sequelize.query(
            `SELECT l.titre, l.resume, l.id_image, l.tag, l.date_sortie
             FROM bookrpg.livre l
                      JOIN bookrpg.aventure a ON l.id = a.id_livre
             GROUP BY l.id
             ORDER BY COUNT(DISTINCT a.id_utilisateur) DESC LIMIT 10;`,
            {type: sequelize.QueryTypes.SELECT, transaction},
        );
        // si le retour est un tableau vide on retourne la liste des livres
        if (livres.length === 0) {
            const livres = await Livre.findAll({
                order: [["date_sortie", "DESC"]],
                include: [
                    {
                        model: Image,
                        as: "image",
                        attributes: ["image"],
                    },
                ],
                limit: 10,
            });
            await transaction.commit();
            res.status(200).json(livres);
            return;
        }
        await transaction.commit();
        res.status(200).json(livres);
    } catch (error) {
        if (transaction) await transaction.rollback();
        res.status(500).json({error: error.message});
    }
};
