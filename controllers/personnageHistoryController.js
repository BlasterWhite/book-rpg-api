const sequelize = require("../db/db");

const PersonnageHistory = require("../models/PersonnageHistoryModel");

exports.createPersonnageHistory = async (req, res) => {
    try {
        const {id_personnage, events, sections} = req.body;
        await PersonnageHistory.create({
            id_personnage,
            events,
            sections,
        });
        res.status(201).json("Personnage history created");
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}


exports.getPersonnageHistory = async (req, res) => {
    try {
        const {id} = req.params;
        const personnageHistory = await PersonnageHistory.findOne({
            where: {
                id_personnage: id,
            },
        });
        res.status(200).json(personnageHistory);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

exports.updatePersonnageHistory = async (req, res) => {
    try {
        const {id} = req.params;
        const {events, sections} = req.body;
        const result = await sequelize.transaction(async (t) => {
            const personnageHistory = await PersonnageHistory.findOne({
                where: {
                    id_personnage: id,
                },
                transaction: t,
            });
            if (!personnageHistory) return {
                code: 404,
                error: "Personnage history not found",
            }
            if (events) personnageHistory.dataValues.events.push(...events)
            if (sections) personnageHistory.dataValues.sections.push(...sections);

            return await PersonnageHistory.update({
                events: personnageHistory.dataValues.events,
                sections: personnageHistory.dataValues.sections,
            }, {
                where: {
                    id_personnage: id,
                },
                transaction: t,
            });
        });
        if (result.error) {
            return res.status(result.code).json({error: result.error});
        }
        res.status(204).json({message: "Personnage history updated successfully"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}
