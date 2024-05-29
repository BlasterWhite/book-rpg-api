const {DataTypes} = require("sequelize");
const sequelize = require("../db/db");

const User = sequelize.define(
    "utilisateur",
    {
        mail: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        nom: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        prenom: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        mot_de_passe: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        permission: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        creation_date: {
            type: DataTypes.DATE,
            allowNull: true,
        }
    },
    {
        schema: 'bookrpg',
        tableName: "utilisateur", // This is necessary because Sequelize by default takes the table name as the plural of the model name
        defaultScope: {
            attributes: {
                exclude: ['mot_de_passe']
            }
        }
    },
);

module.exports = User;
