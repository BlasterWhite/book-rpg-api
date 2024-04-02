const { DataTypes } = require("sequelize");
const sequelize = require("../db/db");
const { Personnage } = require("./personnageModels");
const User = require("./userModels");
const Livre = require("./livreModels");
const Section = require("./sectionModels");

const Aventure = sequelize.define(
  "aventure",
  {
    id_utilisateur: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_livre: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_section_actuelle: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_personnage: {
      type: DataTypes.INTEGER,
      allowNull: false,
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

Aventure.hasOne(User, {
  foreignKey: "id_utilisateur",
  as: "utilisateurs",
});
User.belongsTo(Aventure);

Aventure.hasOne(Livre, {
  foreignKey: "id_livre",
  as: "livres",
});
Livre.belongsTo(Aventure);

Aventure.hasOne(Section, {
  foreignKey: "id_section_actuelle",
  as: "sections",
});
Section.belongsTo(Aventure);

Aventure.hasOne(Personnage, {
  foreignKey: "id_personnage",
  as: "personnages",
});
Personnage.belongsTo(Aventure);

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
