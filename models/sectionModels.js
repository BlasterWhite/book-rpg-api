const { DataTypes } = require("sequelize");
const sequelize = require("../db/db");

const Image = require("./imageModels");
const Livre = require("./livreModels");
const Resultat = require("./resultatModels");

const Section = sequelize.define(
  "section",
  {
    id_livre: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    numero_section: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    texte: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id_image: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    schema: "bookrpg",
    tableName: "section", // This is necessary because Sequelize by default takes the table name as the plural of the model name
    defaultScope: {
      attributes: {
        exclude: [],
      },
    },
  },
);

const Destination = sequelize.define(
  "destination",
  {
    id_section: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Section,
        key: "id",
      },
    },
    id_section_destination: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    schema: "bookrpg",
    tableName: "destination", // This is necessary because Sequelize by default takes the table name as the plural of the model name
    defaultScope: {
      attributes: {
        exclude: [],
      },
    },
  },
);

Section.hasOne(Image, {
  foreignKey: "id_image",
  as: "images",
});
Image.belongsTo(Section);

Section.belongsToMany(Section, {
  through: "association_liaison_section",
  foreignKey: "id_section_source",
  as: "sections",
  otherKey: "id_section_destination",
});

Section.getAttributes = () => {
  return ["id", "id_livre", "numero_section", "texte", "id_image", "type"];
};

module.exports = {Section, Destination};
