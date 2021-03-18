const {
  sequelize,
  dataTypes,
  checkModelName,
  checkUniqueIndex,
  checkPropertyExists,
} = require("sequelize-test-helpers");

const ChaptersModel = require("../../../Models/Chapters");

describe("../Models/Chapters", () => {
  const Chapters = ChaptersModel(sequelize, dataTypes);
  const chapters = new Chapters();

  checkModelName(Chapters)("Chapters");

  context("properties", () => {
    ["id", "name", "toRemove"].forEach(checkPropertyExists(chapters));
  });

  context("indexes", () => {
    ["id_chapter", "name_of_chapter"].forEach(checkUniqueIndex(chapters));
  });
});
