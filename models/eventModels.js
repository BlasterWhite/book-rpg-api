const { DataTypes } = require("sequelize");
const sequelize = require("../db/db");

const Event = sequelize.define(
  "event",
  {
    operation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    which: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    value: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    schema: "bookrpg",
    tableName: "event",
    defaultScope: {
      attributes: {
        exclude: [],
      },
    },
  },
);

Event.getAttributes = () => {
  return ["id", "operation", "which", "type", "value"];
};

module.exports = Event;
