const { DataTypes } = require("sequelize");
const sequelize = require("../db/db");
const Armes = require("./armeModels");
const Equipement = require("./equipementModels");

const PersonnageModels = sequelize.define(
  "personnage",
  {
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id_image: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    occupation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    apparence: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dexterite: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    endurance: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    psychisme: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    force: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    resistance: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    schema: "bookrpg",
    tableName: "personnage", // This is necessary because Sequelize by default takes the table name as the plural of the model name
    defaultScope: {
      attributes: {
        exclude: [],
      },
    },
  },
);

PersonnageModels.belongsToMany(Armes, {
  through: "association_arme_personnage",
});
Armes.belongsToMany(PersonnageModels, {
  through: "association_arme_personnage",
});

PersonnageModels.belongsToMany(Equipement, {
  through: "association_equipement_personnage",
});
Equipement.belongsToMany(PersonnageModels, {
  through: "association_equipement_personnage",
});

PersonnageModels.getAttributes = () => {
  return [
    "nom",
    "description",
    "id_image",
    "occupation",
    "apparence",
    "dexterite",
    "endurance",
    "psychisme",
    "force",
    "resistance",
  ];
};

module.exports = PersonnageModels;
