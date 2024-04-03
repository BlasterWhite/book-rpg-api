const {DataTypes} = require("sequelize");
const sequelize = require("../db/db");

const Image = require("./imageModels");

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
    foreignKey: "id",
});
Image.hasOne(Livre, {
    foreignKey: "id_image",
});

module.exports = Livre;
