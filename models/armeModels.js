const { DataTypes } = require("sequelize");
const sequelize = require("../db/db");

const Arme = sequelize.define(
  "arme",
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
    degats: {
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
    tableName: "arme", // This is necessary because Sequelize by default takes the table name as the plural of the model name
    defaultScope: {
      attributes: {
        exclude: [],
      },
    },
  },
);

Arme.hasOne(Image, {
  foreignKey: "id_image",
  as: "images",
});
Image.belongsTo(Arme);

Arme.getAttributes = () => {
  return ["id", "nom", "description", "id_image", "degats"];
};

module.exports = Arme;
