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
        field: "id_type_of_user_role",
      },
      name: {
        type: DataTypes.STRING(20),
        unique: true,
        allowNull: false,
        field: "name_of_user_role",
      },
    },
    {
      indexes: [
        { unique: true, fields: ["id_type_of_user_role"] },
        { unique: true, fields: ["name_of_user_role"] },
      ],
    }
  );
  return TypesOfUsersRoles;
};

module.exports = model;
