const sequelize = require("../db/db");

const Aventure = require("../models/aventureModels");
const User = require("../models/userModels");
const Livre = require("../models/livreModels");
const Section = require("../models/sectionModels");
const {Personnage} = require("../models/personnageModels");

exports.createAventure = async (req, res) => {
    let transaction;
    try {
        const {id_utilisateur, id_livre, id_section_actuelle, id_personnage} = req.body;
        transaction = await sequelize.transaction();
        if (!id_utilisateur) {
            res.status(400).json({error: "id_utilisateur is required"});
            return;
        }
        if (!id_livre) {
            res.status(400).json({error: "id_livre is required"});
            return;
        }
        if (!id_section_actuelle) {
            res.status(400).json({error: "id_section_actuelle is required"});
            return;
        }
        if (!id_personnage) {
            res.status(400).json({error: "id_personnage is required"});
            return;
        }

        const utilisateur = await User.findByPk(id_utilisateur, {transaction});
        if (!utilisateur) {
            res.status(404).json({error: "id_utilisateur not found"});
            return;
        }

        const livre = await Livre.findByPk(id_livre, {transaction});
        if (!livre) {
            res.status(404).json({error: "id_livre not found"});
            return;
        }

        const section = await Section.findByPk(id_section_actuelle, {transaction});
        if (!section) {
            res.status(404).json({error: "id_section_actuelle not found"});
            return;
        }

        const personnage = await Personnage.findByPk(id_personnage, {transaction});
        if (!personnage) {
            res.status(404).json({error: "id_personnage not found"});
            return;
        }
        // on vérifie que une aventure avc l'id de personnage n'existe pas
        const aventureExist = await Aventure.findOne({
            where: {
                id_personnage,
                statut: "en cours"
            },
            transaction
        });
        if (aventureExist) {
            res.status(400).json({error: "aventure already exist"});
            return;
        }

        const aventure = await Aventure.create({
            id_utilisateur,
            id_livre,
            id_section_actuelle,
            id_personnage,
            statut: "en cours",
        }, {transaction});

        await transaction.commit();
        res.status(201).json(aventure);
    } catch (error) {
        if (transaction) await transaction.rollback();
        res.status(500).json({error: error.message, stack: error.stack});
    }
};

exports.getAllAventure = async (req, res) => {
    try {
        const aventure = await Aventure.findAll({
            attributes: [...Aventure.getAttributes()],
        });
        res.status(200).json(aventure);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.getOneAventure = async (req, res) => {
    try {
        const {id} = req.params;
        const aventure = await Aventure.findByPk(id);
        res.status(200).json(aventure);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.updateAventure = async (req, res) => {
    try {
        const {id} = req.params;
        const {
            id_section_actuelle,
            statut,
        } = req.body;

        await Aventure.update(
            {id_section_actuelle, statut},
            {
                where: {
                    id,
                },
            },
        );
        res.status(200).json({message: "Aventure updated"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.deleteAventure = async (req, res) => {
    try {
        const {id} = req.params;
        await Aventure.destroy({
            where: {
                id,
            },
        });
        res.status(200).json({message: "Aventure deleted"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};
