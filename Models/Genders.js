const { Sequelize } = require("sequelize");

const model = (sequelize, DataTypes) => {
  const Genders = sequelize.define(
    "Genders",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        unique: true,
        allowNull: false,
        field: "idGender",
      },
      name: {
        type: DataTypes.STRING(20),
        unique: true,
        allowNull: false,
        field: "nameOfGender",
      },
    },
    {
      indexes: [
        { unique: true, fields: ["idGender"] },
        { unique: true, fields: ["nameOfGender"] },
      ],
    }
  );
  return Genders;
};

module.exports = model;
