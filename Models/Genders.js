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
        field: "id_gender",
      },
      name: {
        type: DataTypes.STRING(20),
        unique: true,
        allowNull: false,
        field: "name_of_gender",
      },
    },
    {
      indexes: [
        { unique: true, fields: ["id_gender"] },
        { unique: true, fields: ["name_of_gender"] },
      ],
    }
  );
  return Genders;
};

module.exports = model;
