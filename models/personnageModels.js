const { DataTypes } = require("sequelize");
const sequelize = require("../db/db");

const Armes = require("./armeModels");
const Image = require("./imageModels");
const Equipement = require("./equipementModels");

const Personnage = sequelize.define(
  "personnage",
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
      references: {
        model: Image, // This is a reference to another model
        key: "id",
      },
    },
    occupation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    apparence: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dexterite: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    endurance: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    psychisme: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    force: {
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
    tableName: "personnage", // This is necessary because Sequelize by default takes the table name as the plural of the model name
    defaultScope: {
      attributes: {
        exclude: [],
      },
    },
  },
);

const AssociationArmePersonnage = sequelize.define(
  "association_arme_personnage",
  {
    id_personnage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Personnage,
        key: "id",
      },
    },
    id_arme: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Armes,
        key: "id",
      },
    },
  },
  {
    schema: "bookrpg",
    tableName: "association_arme_personnage",
  },
);

const AssociationEquipementPersonnage = sequelize.define(
  "association_equipement_personnage",
  {
    id_personnage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Personnage,
        key: "id",
      },
    },
    id_equipement: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Equipement,
        key: "id",
      },
    },
  },
  {
    schema: "bookrpg",
    tableName: "association_equipement_personnage",
  },
);

Personnage.belongsToMany(Armes, {
  through: AssociationArmePersonnage,
  foreignKey: "id_personnage",
});
Armes.belongsToMany(Personnage, {
  through: AssociationArmePersonnage,
  foreignKey: "id_arme",
});

Personnage.belongsToMany(Equipement, {
  through: AssociationEquipementPersonnage,
  foreignKey: "id_personnage",
});
Equipement.belongsToMany(Personnage, {
  through: AssociationEquipementPersonnage,
  foreignKey: "id_equipement",
});

Personnage.getAttributes = () => {
  return [
    "nom",
    "description",
    "id_image",
    "occupation",
    "apparence",
    "dexterite",
    "endurance",
    "psychisme",
    "force",
    "resistance",
  ];
};

module.exports = {
  Personnage,
  AssociationArmePersonnage,
  AssociationEquipementPersonnage,
};
