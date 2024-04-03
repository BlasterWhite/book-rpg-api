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
      references: {
        model: Image,
        key: "id",
      },
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

const AssociationLiaisonSection = sequelize.define(
  "association_liaison_section",
  {
      id_section_source: {
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
          references: {
              model: Section,
              key: "id",
          },
      },
  },
  {
      schema: "bookrpg",
      tableName: "association_liaison_section"
  }
);

Section.belongsToMany(Section, {
  through: AssociationLiaisonSection,
  as: "sections",
  foreignKey: "id_section_source",
  otherKey: "id_section_destination",
});

Section.hasOne(Image, {
  foreignKey: "id_image",
  as: "images",
});
Image.belongsTo(Section);

Section.hasOne(Livre, {
  foreignKey: "id_livre",
  as: "livres",
});
Livre.belongsTo(Section);

Section.hasOne(Resultat, {
  foreignKey: "id_section",
  as: "resultats",
});

Section.getAttributes = () => {
  return ["id", "id_livre", "numero_section", "texte", "id_image", "type"];
};

module.exports = Section;
