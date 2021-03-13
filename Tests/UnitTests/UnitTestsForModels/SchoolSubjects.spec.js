const {
  sequelize,
  dataTypes,
  checkModelName,
  checkUniqueIndex,
  checkPropertyExists,
} = require("sequelize-test-helpers");

const SchoolSubjectsModel = require("../../../Models/SchoolSubjects");

describe("../Models/SchoolSubjects", () => {
  const SchoolSubjects = SchoolSubjectsModel(sequelize, dataTypes);
  const schoolSubjects = new SchoolSubjects();

  checkModelName(SchoolSubjects)("SchoolSubjects");

  context("properties", () => {
    ["id", "name"].forEach(checkPropertyExists(schoolSubjects));
  });

  context("indexes", () => {
    ["id_school_subject", "name_of_school_subject"].forEach(
      checkUniqueIndex(schoolSubjects)
    );
  });
});
