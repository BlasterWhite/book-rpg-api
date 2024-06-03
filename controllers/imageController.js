const Image = require("../models/imageModels");
const sequelize = require("../db/db");

exports.createImage = async (req, res) => {
    try {
        if (!req.body.prompt) {
            return res.status(400).json({error: "Please provide a prompt"});
        }

        const result = await sequelize.transaction(async t => {
            const response = await fetch("https://api.getimg.ai/v1/essential/text-to-image", {
                method: "POST",
                headers: {
                    accept: "application/json",
                    "content-type": "application/json",
                    authorization: `Bearer ${process.env.KEY}`,
                },
                body: JSON.stringify({
                    prompt: req.body.prompt.toString(),
                }),
            });
            const data = await response.json();
            if (data.error) {
                return {
                    code: 400,
                    error: data.error,
                };
            }
            const image = await Image.create({image: data.image}, {transaction: t});
            return {
                code: 201,
                image
            };
        });
        if (result.error) {
            return res.status(result.code).json({error: result.error});
        }
        res.status(201).json(result.image);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.createImageB64 = async (req, res) => {
    try {
        if (!req.body.image) {
            return res.status(400).json({error: "Please provide an image"});
        }

        const result = await sequelize.transaction(async t => {
            return await Image.create({image: req.body.image}, {transaction: t});
        });
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.createImageURL = async (req, res) => {
    try {
        if (!req.body.url) {
            return res.status(400).json({error: "Please provide an url"});
        }
        const result = await sequelize.transaction(async t => {
            return await Image.create({image: req.body.url}, {transaction: t});
        });
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.deleteImage = async (req, res) => {
    try {
        const {id} = req.params;
        const result = await sequelize.transaction(async t => {
            const image = await Image.findByPk(id, {transaction: t});
            if (!image) {
                return {
                    code: 404,
                    error: "Image not found",
                };
            }
            return await image.destroy({transaction: t});
        });
        if (result.error) {
            return res.status(result.code).json({error: result.error});
        }
        res.status(200).json({message: `Image ${id} deleted`});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};
