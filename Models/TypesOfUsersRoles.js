const { Sequelize } = require("sequelize");

const model = (sequelize, DataTypes) => {
  const TypesOfUsersRoles = sequelize.define(
    "TypesOfUsersRoles",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        unique: true,
        allowNull: false,
        field: "idTypeOfUserRole",
      },
      name: {
        type: DataTypes.STRING(20),
        unique: true,
        allowNull: false,
        field: "nameOfUserRole",
      },
    },
    {
      indexes: [
        { unique: true, fields: ["idTypeOfUserRole"] },
        { unique: true, fields: ["nameOfUserRole"] },
      ],
    }
  );
  return TypesOfUsersRoles;
};

module.exports = model;
