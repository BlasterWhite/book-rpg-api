const { DataTypes } = require("sequelize");
const sequelize = require("../db/db");
const Image = require("./imageModels");

const Arme = sequelize.define(
  "arme",
  {
    titre: {
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
    degats: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    durabilite: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    schema: "bookrpg",
    tableName: "arme", // This is necessary because Sequelize by default takes the table name as the plural of the model name
    defaultScope: {
      attributes: {
        exclude: [],
      },
    },
  },
);

Arme.hasOne(Image, {
  foreignKey: "id",
  sourceKey: "id_image",
  as: "image",
});

Arme.getAttributes = () => {
  return ["id", "nom", "description", "id_image", "degats"];
};

module.exports = Arme;
