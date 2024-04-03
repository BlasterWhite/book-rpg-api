const {DataTypes} = require("sequelize");
const sequelize = require("../db/db");

const Image = require("./imageModels");
const {Personnage} = require("./personnageModels");

const Livre = sequelize.define(
    "livre",
    {
        titre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        resume: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        id_image: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Image, // This is a reference to another model
                key: "id",
            },
        },
        tag: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        date_sortie: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        id_personnage_default: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: Personnage, // This is a reference to another model
                key: "id",
            }
        },
    },
    {
        schema: "bookrpg",
        tableName: "livre", // This is necessary because Sequelize by default takes the table name as the plural of the model name
        defaultScope: {
            attributes: {
                exclude: [],
            },
        },
    },
);

Livre.belongsTo(Image, {
    foreignKey: "id_image",
    targetKey: "id",
    as: "image",
});
Image.hasOne(Livre, {
    foreignKey: "id_image",
    sourceKey: "id",
    as: "livre",
});

Livre.belongsTo(Personnage, {
    foreignKey: "id_personnage_default",
    targetKey: "id",
    as: "personnage_default",
});

Personnage.hasOne(Livre, {
    foreignKey: "id_personnage_default",
    sourceKey: "id",
    as: "livre",
});

module.exports = Livre;
