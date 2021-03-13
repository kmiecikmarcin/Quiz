const { DataTypes } = require("sequelize");
const sequelize = require("../Database/database");
const TypesOfUsersRolesModel = require("../../Models/TypesOfUsersRoles");
const GendersModel = require("../../Models/Genders");
const UsersModel = require("../../Models/Users");
const SchoolSubjectsModel = require("../../Models/Users");

const TypesOfUsersRoles = TypesOfUsersRolesModel(sequelize, DataTypes);
const Genders = GendersModel(sequelize, DataTypes);
const Users = UsersModel(sequelize, DataTypes);
const SchoolSubjects = SchoolSubjectsModel(sequelize, DataTypes);

module.exports = {
  TypesOfUsersRoles,
  Genders,
  Users,
  SchoolSubjects,
};
