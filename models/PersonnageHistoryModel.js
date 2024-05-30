const {DataTypes} = require("sequelize");
const sequelize = require("../db/db");
const {Personnage} = require("./personnageModels");
const Section = require("./sectionModels");
const Event = require("./eventModels");

const PersonnageHistory = sequelize.define(
    "personnage_history",
    {
        id_personnage: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Personnage,
                key: "id",
            },
        },
        events: {
            type: DataTypes.ARRAY(DataTypes.INTEGER),
            allowNull: true,
            references: {
                model: Event,
                key: "id",
            }
        },
        sections: {
            type: DataTypes.ARRAY(DataTypes.INTEGER),
            allowNull: true,
            references: {
                model: Section,
                key: "id",
            }
        },
    },
    {
        schema: "bookrpg",
        tableName: "personnage_history",
        defaultScope: {
            attributes: {
                exclude: [],
            },
        },
    },
);

module.exports = PersonnageHistory;