const { DataTypes } = require("sequelize");
const sequelize = require("../db/db");

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
  as: "images",
});
Image.belongsTo(Equipement);

Equipement.getAttributes = () => {
  return ["id", "nom", "description", "id_image", "resistance"];
};

module.exports = Equipement;
