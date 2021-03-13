const { Sequelize } = require("sequelize");

const model = (sequelize, DataTypes) => {
  const SchoolSubjects = sequelize.define(
    "SchoolSubjects",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        unique: true,
        allowNull: false,
        field: "id_school_subject",
      },
      name: {
        type: DataTypes.STRING(20),
        unique: true,
        allowNull: false,
        field: "name_of_school_subject",
      },
    },
    {
      indexes: [
        { unique: true, fields: ["id_school_subject"] },
        { unique: true, fields: ["name_of_school_subject"] },
      ],
    }
  );
  return SchoolSubjects;
};

module.exports = model;
