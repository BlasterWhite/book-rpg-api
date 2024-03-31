const { DataTypes } = require("sequelize");
const sequelize = require("../db/db");

const Image = require("./imageModels");
const Livre = require("./livreModels");

const SectionModels = sequelize.define(
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

SectionModels.hasOne(Image, {
  foreignKey: "id_image",
  as: "images",
});
Image.belongsTo(SectionModels);

SectionModels.hasOne(Livre, {
  foreignKey: "id_livre",
  as: "livres",
});
Livre.belongsTo(SectionModels);

SectionModels.belongsToMany(SectionModels, {
  through: "association_liaison_section",
  foreignKey: "id_section_source",
  as: "sections",
  otherKey: "id_section_destination",
});

SectionModels.getAttributes = () => {
  return ["id", "id_livre", "numero_section", "texte", "id_image", "type"];
};

module.exports = SectionModels;
