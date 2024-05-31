const {DataTypes} = require("sequelize");
const sequelize = require("../db/db");

const Event = require("./eventModels");
const {Personnage} = require("./personnageModels");

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
        timestamps: true,
        updatedAt: "updated_at",
        createdAt: false
    },
);

module.exports = PersonnageHistory;