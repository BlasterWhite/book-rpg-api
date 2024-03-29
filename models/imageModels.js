const { DataTypes } = require("sequelize");
const sequelize = require("../db/db");

const Image = sequelize.define(
  "image",
  {
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    schema: "bookrpg",
    tableName: "image", // This is necessary because Sequelize by default takes the table name as the plural of the model name
    defaultScope: {
      attributes: {
        exclude: [],
      },
    },
  },
);

Image.getAttributes = () => {
  return ["id", "image"];
};

module.exports = Image;
