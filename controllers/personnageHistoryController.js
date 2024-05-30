const sequelize = require("../db/db");

const PersonnageHistory = require("../models/PersonnageHistoryModel");

exports.createPersonnageHistory = async (req, res) => {
    try {
        const { id_personnage, events, sections } = req.body;
        await PersonnageHistory.create({
            id_personnage,
            events,
            sections,
        });
        res.status(201).json("Personnage history created");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


exports.getPersonnageHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const personnageHistory = await PersonnageHistory.findOne({
            where: {
                id_personnage: id,
            },
        });
        res.status(200).json(personnageHistory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.updatePersonnageHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const { events, sections } = req.body;
        const result = await sequelize.transaction(async (t) => {
            const personnageHistory = await PersonnageHistory.findOne({
                where: {
                    id_personnage: id,
                },
            });
            if (events) {
                personnageHistory.events = personnageHistory.events.concat(events);
            }

            if (sections) {
                personnageHistory.sections = personnageHistory.sections.concat(sections);
            }
            await personnageHistory.save({ transaction: t });
            return personnageHistory;
        });
        res.status(204).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
