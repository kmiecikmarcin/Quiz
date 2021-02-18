const express = require("express");
const bodyParser = require("body-parser");
const { DataTypes } = require("sequelize");
const sequelize = require("./Functions/Database/database");
const TypesOfUserRolesModel = require("./Models/TypesOfUsersRoles");
const UsersModel = require("./Models/Users");
const GendersModel = require("./Models/Genders");

const TypesOfUsersRoles = TypesOfUserRolesModel(sequelize, DataTypes);
const Genders = GendersModel(sequelize, DataTypes);
const Users = UsersModel(sequelize, DataTypes);

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database created!");
  })
  .catch((error) => {
    throw new Error(error);
  });

const port = process.env.PORT || 3000;

app.listen(port);

module.exports = app;
