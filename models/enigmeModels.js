const { DataTypes } = require("sequelize");
const sequelize = require("../db/db");

const Enigme = sequelize.define(
  "enigme",
  {
    id_section: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    enigme: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reponse: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    schema: "bookrpg",
    tableName: "enigme", // This is necessary because Sequelize by default takes the table name as the plural of the model name
    defaultScope: {
      attributes: {
        exclude: [],
      },
    },
  },
);

Enigme.hasOne(Image, {
  foreignKey: "id_image",
  as: "images",
});
Image.belongsTo(Enigme);

Enigme.getAttributes = () => {
  return ["id", "question", "reponse", "id_image"];
};

module.exports = Enigme;
