const { DataTypes } = require("sequelize");
const sequelize = require("../Database/database");
const TypesOfUsersRolesModel = require("../../Models/TypesOfUsersRoles");
const GendersModel = require("../../Models/Genders");
const UsersModel = require("../../Models/Users");
const SchoolSubjectsModel = require("../../Models/Users");
const ChaptersModel = require("../../Models/Chapters");

const TypesOfUsersRoles = TypesOfUsersRolesModel(sequelize, DataTypes);
const Genders = GendersModel(sequelize, DataTypes);
const Users = UsersModel(sequelize, DataTypes);
const SchoolSubjects = SchoolSubjectsModel(sequelize, DataTypes);
const Chapters = ChaptersModel(sequelize, DataTypes);

module.exports = {
  TypesOfUsersRoles,
  Genders,
  Users,
  SchoolSubjects,
  Chapters,
};
