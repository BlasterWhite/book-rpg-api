const { DataTypes } = require("sequelize");
const sequelize = require("../db/db");
const Image = require("./imageModels");

const Equipement = sequelize.define(
  "equipement",
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
      references: {
        model: Image, // This is a reference to another model
        key: "id",
      },
    },
    resistance: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    schema: "bookrpg",
    tableName: "equipement", // This is necessary because Sequelize by default takes the table name as the plural of the model name
    defaultScope: {
      attributes: {
        exclude: [],
      },
    },
  },
);

Equipement.hasOne(Image, {
  foreignKey: "id_image",
  sourceKey: "id",
  as: "image",
});

Equipement.getAttributes = () => {
  return ["id", "nom", "description", "id_image", "resistance"];
};

module.exports = Equipement;
