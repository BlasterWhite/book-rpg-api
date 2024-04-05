const Image = require("../models/imageModels");
const sequelize = require("../db/db");

exports.getAllImages = async (req, res) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const images = await Image.findAll({transaction});
        await transaction.commit();
        res.status(200).json(images);
    } catch (error) {
        if (transaction) await transaction.rollback();
        res.status(500).json({error: error.message});
    }
};

exports.getOneImage = async (req, res) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const image = await Image.findByPk(req.params.id, {transaction});
        await transaction.commit();
        res.status(200).json(image);
    } catch (error) {
        if (transaction) await transaction.rollback();
        res.status(500).json({error: error.message});
    }
};

exports.createImage = async (req, res) => {
    let transaction;
    try {
        if (!req.body.prompt) {
            return res.status(400).json({error: "Please provide a prompt"});
        }
        transaction = await sequelize.transaction();
        fetch("https://api.getimg.ai/v1/essential/text-to-image", {
            method: "POST",
            headers: {
                accept: "application/json",
                "content-type": "application/json",
                authorization: `Bearer ${process.env.KEY}`,
            },
            body: JSON.stringify({
                prompt: req.body.prompt.toString(),
            }),
        })
            .then((response) => response.json())
            .then(async (response) => {
                if (response.error) {
                    if (transaction) transaction.rollback();
                    return res.status(400).json({error: response.error});
                }
                const image = await Image.create({image: response.image}, {transaction});
                await transaction.commit();
                res.status(201).json(image);
            })
            .catch((err) => {
                if (transaction) transaction.rollback();
                res.status(500).json({error: err.message});
            });
    } catch (error) {
        if (transaction) await transaction.rollback();
        res.status(500).json({error: error.message});
    }
};

exports.createImageB64 = async (req, res) => {
    let transaction;
    try {
        if (!req.body.image) {
            return res.status(400).json({error: "Please provide an image"});
        }
        transaction = await sequelize.transaction();
        const image = await Image.create({image: req.body.image}, {transaction});
        await transaction.commit();
        res.status(201).json(image);
    } catch (error) {
        if (transaction) await transaction.rollback();
        res.status(500).json({error: error.message});
    }
};

exports.createImageURL = async (req, res) => {
    let transaction;
    try {
        if (!req.body.url) {
            return res.status(400).json({error: "Please provide an url"});
        }
        transaction = await sequelize.transaction();
        const image = await Image.create({image: req.body.url}, {transaction});
        await transaction.commit();
        res.status(201).json(image);
    } catch (error) {
        if (transaction) await transaction.rollback();
        res.status(500).json({error: error.message});
    }
};

exports.updateImage = async (req, res) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const image = await Image.findByPk(req.params.id, {transaction});
        if (!image) {
            return res.status(404).json({error: "Image not found"});
        }
        await image.update(req.body, {
            where: {
                id: req.params.id,
            },
        }, {transaction});
        await transaction.commit();
        res.json(image);
    } catch (error) {
        if (transaction) await transaction.rollback();
        res.status(500).json({error: error.message});
    }
};

exports.deleteImage = async (req, res) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        const image = await Image.findByPk(req.params.id, {transaction});
        await image.destroy({
            transaction
        });
        await transaction.commit();
        res.json({message: `Image ${req.params.id} deleted`});
    } catch (error) {
        if (transaction) await transaction.rollback();
        res.status(500).json({error: error.message});
    }
};
