const {DataTypes} = require("sequelize");
const sequelize = require("../db/db");
const User = require("./userModels");
const Livre = require("./livreModels");
const Section = require("./sectionModels");
const {Personnage} = require("./personnageModels");

const Aventure = sequelize.define(
    "aventure",
    {
        id_utilisateur: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: "id",
            }
        },
        id_livre: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Livre,
                key: "id",
            }
        },
        id_section_actuelle: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Section,
                key: "id",
            }
        },
        id_personnage: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Personnage,
                key: "id",
            },
        },
        statut: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        schema: "bookrpg",
        tableName: "aventure", // This is necessary because Sequelize by default takes the table name as the plural of the model name
        defaultScope: {
            attributes: {
                exclude: [],
            },
        },
    },
);

Aventure.belongsTo(User, {
    foreignKey: "id_utilisateur",
});
Aventure.belongsTo(Livre, {
    foreignKey: "id_livre",
});
Aventure.belongsTo(Section, {
    foreignKey: "id_section_actuelle",
});
Aventure.belongsTo(Personnage, {
    foreignKey: "id_personnage",
});

Aventure.hasOne(Section, {
    foreignKey: "id",
});
Aventure.hasOne(Personnage, {
    foreignKey: "id",
});
Aventure.hasOne(User, {
    foreignKey: "id",
});

Aventure.getAttributes = () => {
    return [
        "id_utilisateur",
        "id_livre",
        "id_section_actuelle",
        "id_personnage",
        "statut",
    ];
};

module.exports = Aventure;