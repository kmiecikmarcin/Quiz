const { Sequelize } = require("sequelize");
const GendersModel = require("./Genders");
const TypesOfUserRolesModel = require("./TypesOfUsersRoles");

const model = (sequelize, DataTypes) => {
  const Genders = GendersModel(sequelize, DataTypes);
  const TypesOfUserRoles = TypesOfUserRolesModel(sequelize, DataTypes);
  const Users = sequelize.define(
    "Users",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        unique: true,
        allowNull: false,
        field: "id_user",
      },
      email: {
        type: DataTypes.STRING(128),
        unique: true,
        allowNull: false,
        field: "user_email",
      },
      password: {
        type: DataTypes.STRING(64),
        allowNull: false,
        field: "user_password",
      },
      accountToBeDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        field: "account_deleted_status",
      },
    },
    {
      indexes: [
        { unique: true, fields: ["id_user"] },
        { unique: true, fields: ["user_email"] },
      ],
    }
  );
  Users.belongsTo(Genders);
  Users.belongsTo(TypesOfUserRoles);

  Users.associate = ({ Genders, TypesOfUserRoles }) => {
    Users.belongsTo(Genders);
    Users.belongsTo(TypesOfUserRoles);
  };

  return Users;
};

module.exports = model;
