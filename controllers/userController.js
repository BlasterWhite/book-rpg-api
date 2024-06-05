const sequelize = require("../db/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/userModels");
const Aventure = require("../models/aventureModels");
const {Personnage} = require("../models/personnageModels");
const Section = require("../models/sectionModels");

exports.loginUser = async (req, res) => {
    try {
        const result = await sequelize.transaction(async t => {
            const {email, password} = req.body;
            const user = await User.findOne({
                where: {
                    mail: email,
                },
                transaction: t,
                attributes: ["id", "mail", "mot_de_passe", "nom", "prenom", "permission", "creation_date"],
            });

            if (!user) {
                return {
                    error: "User not found !",
                    code: 404,
                };
            }

            const isPasswordValid = await bcrypt.compare(password, user.mot_de_passe);

            if (!isPasswordValid) {
                return {
                    error: "Invalid user or password !",
                    code: 401,
                };
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.mail,
                    permission: user.permission
                },
                "sklLeevR0FHz5ha%2ys#",
                {
                    expiresIn: "24h",
                },
            );
            return {
                token,
                user: {
                    id: user.id,
                    email: user.mail,
                    lastname: user.nom,
                    firstname: user.prenom,
                    permission: user.permission,
                    creation_date: user.creation_date
                },
            };
        });
        if (result.error) {
            return res.status(result.code).json({error: result.error});
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.registerUser = async (req, res) => {
    try {
        const result = await sequelize.transaction(async t => {
            const {email, firstname, lastname, password} = req.body;
            const mot_de_passe_crypte = await bcrypt.hash(password, 10);
            const [user, created] = await User.findOrCreate({
                where: {
                    mail: email,
                },
                defaults: {
                    mail: email,
                    nom: lastname,
                    prenom: firstname,
                    mot_de_passe: mot_de_passe_crypte,
                },
                transaction: t,
            });
            if (!created) {
                return {
                    error: "User already exists",
                    code: 400,
                };
            }
            return {
                user,
                code: 201,
            };
        });
        if (result.error) {
            return res.status(result.code).json({error: result.error});
        }
        res.status(201).json(result.user);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        if (req.user.permission !== "admin") {
            return res.status(403).json({error: "You don't have the rights for this action"});
        }
        const users = await User.findAll({
            attributes: ["mail", "nom", "prenom", "permission", "creation_date"],
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.getUserById = async (req, res) => {
    try {
        const {id} = req.params
        if (String(id) !== String(req.user.id) && req.user.permission !== "admin") {
            return res.status(403).json({error: "You don't have the rights for this action"});
        }
        const user = await User.findByPk(id, {
            attributes: ["mail", "nom", "prenom", "permission", "creation_date"],
        });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.updateUser = async (req, res) => {
    try {
        const {id} = req.params;

        if (String(id) !== String(req.user.id) && req.user.permission !== "admin") {
            return res.status(403).json({error: "You don't have the rights for this action"});
        }

        const {mail, nom, prenom, password} = req.body;
        const mot_de_passe_crypte = await bcrypt.hash(password, 10);
        const result = await sequelize.transaction(async t => {
            const user = await User.findByPk(id, {transaction: t});
            if (!user) {
                return {
                    code: 404,
                    error: "User not found",
                }
            }
            return await user.update(
                {mail, nom, prenom, mot_de_passe: mot_de_passe_crypte},
                {
                    transaction: t,
                },
            );
        });
        if (result.error) {
            return res.status(result.code).json({error: result.error});
        }
        res.status(200).json({message: "User updated"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const {id} = req.params;
        const userFromToken = req.user;
        const result = await sequelize.transaction(async t => {
            if ((String(id) !== String(userFromToken.id)) && (userFromToken.permission !== "admin")) {
                return {
                    code: 403,
                    error: "You don't have the rights for this action",
                }
            }
            const user = await User.findByPk(id, {transaction: t});
            if (!user) {
                return {
                    code: 404,
                    error: "User not found",
                }
            }
            return await user.destroy({transaction: t});
        });
        if (result.error) {
            return res.status(result.code).json({error: result.error});
        }
        res.status(200).json({message: "User deleted"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.getAllAventures = async (req, res) => {
    try {
        const idUser = req.user.id;
        const aventures = await Aventure.findAll({
            where: {
                id_utilisateur: idUser,
            },
            include: [
                {
                    model: Personnage,
                    as: "personnage",
                },
                {
                    model: Section,
                    as: "section",
                }
            ],
        });
        res.status(200).json(aventures);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.getAventureById = async (req, res) => {
    try {
        const {idAventure} = req.params;
        const idUser = req.user.id;
        const aventure = await Aventure.findAll({
            where: {
                id: idAventure,
                id_utilisateur: idUser,
            },
            include: [
                {
                    model: Personnage,
                    as: "personnage",
                },
                {
                    model: Section,
                    as: "section",
                }
            ],
        });
        res.status(200).json(aventure);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.getAventureByIdLivre = async (req, res) => {
    try {
        const {idLivre} = req.params;
        const idUser = req.user.id;
        const result = await sequelize.transaction(async t => {
            return await Aventure.findAll({
                where: {
                    id_utilisateur: idUser,
                    id_livre: idLivre,
                },
                include: [
                    {
                        model: Personnage,
                        as: "personnage",
                    },
                    {
                        model: Section,
                        as: "section",
                    }
                ],
                transaction: t,
            });
        });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};
