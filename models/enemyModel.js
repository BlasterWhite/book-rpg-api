const {DataTypes} = require("sequelize");
const sequelize = require("../db/db")
const { Section } = require("./sectionModels");
const {Personnage} = require("./personnageModels");

const Enemy = sequelize.define(
    "enemy",
    {
        id_personnage: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Personnage,
                key: "id",
            },
        },
        id_section: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Section,
                key: "id",
            },
        },
    },
    {
        schema: "bookrpg",
        tableName: "enemy", // This is necessary because Sequelize by default takes the table name as the plural of the model name
        defaultScope: {
            attributes: {
                exclude: [],
            },
        },
    },
);

Enemy.hasOne(Personnage, {
    foreignKey: "id",
    sourceKey: "id_personnage",
});

Personnage.belongsTo(Enemy, {
    foreignKey: "id",
    targetKey: "id_personnage",
});

Enemy.hasOne(Section, {
    foreignKey: "id",
    sourceKey: "id_section",
});

Section.belongsTo(Enemy, {
    foreignKey: "id",
    targetKey: "id_section",
});

module.exports = Enemy;