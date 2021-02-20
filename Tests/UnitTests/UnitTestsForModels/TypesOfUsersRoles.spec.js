const {
  sequelize,
  dataTypes,
  checkModelName,
  checkUniqueIndex,
  checkPropertyExists,
} = require("sequelize-test-helpers");

const TypesOfUsersRolesModel = require("../../../Models/TypesOfUsersRoles");

describe("../Models/TypesOfUsersRoles", () => {
  const TypesOfUsersRoles = TypesOfUsersRolesModel(sequelize, dataTypes);
  const typesOfUsersRoles = new TypesOfUsersRoles();

  checkModelName(TypesOfUsersRoles)("TypesOfUsersRoles");

  context("properties", () => {
    ["id", "name"].forEach(checkPropertyExists(typesOfUsersRoles));
  });

  context("indexes", () => {
    ["idTypeOfUserRole", "nameOfUserRole"].forEach(
      checkUniqueIndex(typesOfUsersRoles)
    );
  });
});
