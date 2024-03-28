const { DataTypes } = require("sequelize");
const sequelize = require("../db/db");

const User = sequelize.define(
  "User",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    birthday: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "User", // This is necessary because Sequelize by default takes the table name as the plural of the model name
  },
);

module.exports = User;
