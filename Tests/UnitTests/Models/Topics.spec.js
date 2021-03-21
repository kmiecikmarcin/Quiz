const {
  sequelize,
  dataTypes,
  checkModelName,
  checkUniqueIndex,
  checkPropertyExists,
} = require("sequelize-test-helpers");

const TopicsModel = require("../../../Models/Topics");

describe("../Models/Topics", () => {
  const Topics = TopicsModel(sequelize, dataTypes);
  const topics = new Topics();

  checkModelName(Topics)("Topics");

  context("properties", () => {
    ["id", "name", "toRemove"].forEach(checkPropertyExists(topics));
  });

  context("indexes", () => {
    ["id_topic", "name_of_topic"].forEach(checkUniqueIndex(topics));
  });
});
