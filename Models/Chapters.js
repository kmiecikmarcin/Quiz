const { Sequelize } = require("sequelize");
const SchoolSubjectsModel = require("./SchoolSubjects");

const model = (sequelize, DataTypes) => {
  const SchoolSubjects = SchoolSubjectsModel(sequelize, DataTypes);
  const Chapters = sequelize.define(
    "Chapters",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        unique: true,
        allowNull: false,
        field: "id_chapter",
      },
      name: {
        type: DataTypes.STRING(64),
        unique: true,
        allowNull: false,
        field: "name_of_chapter",
      },
      toRemove: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        field: "chapters_to_remove",
      },
    },
    {
      indexes: [
        { unique: true, fields: ["id_chapter"] },
        { unique: true, fields: ["name_of_chapter"] },
      ],
    }
  );
  Chapters.belongsTo(SchoolSubjects);

  Chapters.associate = ({ SchoolSubjects }) => {
    Chapters.belongsTo(SchoolSubjects);
  };

  return Chapters;
};

module.exports = model;
