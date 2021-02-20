const {
  sequelize,
  dataTypes,
  checkModelName,
  checkUniqueIndex,
  checkPropertyExists,
} = require("sequelize-test-helpers");

const GendersModel = require("../../../Models/Genders");

describe("../Models/Genders", () => {
  const Genders = GendersModel(sequelize, dataTypes);
  const genders = new Genders();

  checkModelName(Genders)("Genders");

  context("properties", () => {
    ["id", "name"].forEach(checkPropertyExists(genders));
  });

  context("indexes", () => {
    ["idGender", "nameOfGender"].forEach(checkUniqueIndex(genders));
  });
});
