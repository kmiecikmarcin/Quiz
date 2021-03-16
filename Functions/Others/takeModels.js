const { DataTypes } = require("sequelize");
const sequelize = require("../Database/database");
const TypesOfUsersRolesModel = require("../../Models/TypesOfUsersRoles");
const GendersModel = require("../../Models/Genders");
const UsersModel = require("../../Models/Users");
const SchoolSubjectsModel = require("../../Models/SchoolSubjects");
const ChaptersModel = require("../../Models/Chapters");
const TopicsModel = require("../../Models/Topics");

const TypesOfUsersRoles = TypesOfUsersRolesModel(sequelize, DataTypes);
const Genders = GendersModel(sequelize, DataTypes);
const Users = UsersModel(sequelize, DataTypes);
const SchoolSubjects = SchoolSubjectsModel(sequelize, DataTypes);
const Chapters = ChaptersModel(sequelize, DataTypes);
const Topics = TopicsModel(sequelize, DataTypes);

module.exports = {
  TypesOfUsersRoles,
  Genders,
  Users,
  SchoolSubjects,
  Chapters,
  Topics,
};
