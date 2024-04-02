const { DataTypes } = require("sequelize");
const sequelize = require("../db/db");
const Section = require("./sectionModels");

const Resultat = sequelize.define(
    "resultat",
    {
      id_section: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      condition: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type_condition: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gagne: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      perd: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      schema: "bookrpg",
      tableName: "resultat", // This is necessary because Sequelize by default takes the table name as the plural of the model name
      defaultScope: {
        attributes: {
          exclude: [],
        },
      },
    },
);

Section.hasOne(Resultat, {
  foreignKey: "id_section",
  as: "resultats",
});

Resultat.getAttributes = () => {
return ["id", "id_section", "condition", "type_condition", "gagne", "perd"];
};

module.exports = Resultat;