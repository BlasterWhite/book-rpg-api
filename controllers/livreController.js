const Livre = require("../models/livreModels");
const Image = require("../models/imageModels");

exports.createLivre = async (req, res) => {
    try {
        const {titre, resume, id_image, tag, date_sortie} = req.body;
        const livre = await Livre.create({titre, resume, id_image, tag, date_sortie});
        res.status(201).json(livre);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.getAllLivres = async (req, res) => {
    try {
        const livres = await Livre.findAll({
            attributes: ["id", "titre", "resume", "id_image", "tag", "date_sortie"],
            include: [
                {
                    model: Image,
                    as: "image",
                    attributes: ["image"],
                },
            ],
        });
        res.status(200).json(livres);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.getLivreById = async (req, res) => {
    try {
        const {id} = req.params;
        const livre = await Livre.findByPk(id, {
            include: [
                {
                    model: Image,
                    as: "image",
                    attributes: ["image"],
                },
            ],
        });
        res.status(200).json(livre);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.updateLivre = async (req, res) => {
    try {
        const {id} = req.params;
        const {titre, resume, id_image, tag, date_sortie} = req.body;
        await Livre.update(
            {titre, resume, id_image, tag, date_sortie},
            {
                where: {
                    id,
                },
            },
        );
        res.status(200).json({message: "Book updated"});
    } catch (error) {
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
