const {DataTypes} = require("sequelize");
const sequelize = require("../db/db");

const User = require("./userModels");
const Livre = require("./livreModels");

const Favoris = sequelize.define(
    "favori",
    {
        id_utilisateur: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: "id",
            },
        },
        id_livre: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Livre,
                key: "id",
            },
        },
    },
    {
        schema: "bookrpg",
        tableName: "favori",
        defaultScope: {
            attributes: {
                exclude: [],
            },
        },
    },
);

Favoris.belongsTo(User, {
    foreignKey: "id_utilisateur",
    targetKey: "id",
    as: "user",
});
User.hasMany(Favoris, {
    foreignKey: "id_utilisateur",
    as: "favoris",
    onDelete: "CASCADE",
});

Favoris.belongsTo(Livre, {
    foreignKey: "id_livre",
    targetKey: "id",
    as: "livre",
});
Livre.hasMany(Favoris, {
    foreignKey: "id_livre",
    as: "favoris",
});

Favoris.getAttributes = () => {
    return ["id", "id_utilisateur", "id_livre"];
};

module.exports = Favoris;
