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
    ["id_type_of_user_role", "name_of_user_role"].forEach(
      checkUniqueIndex(typesOfUsersRoles)
    );
  });
});
