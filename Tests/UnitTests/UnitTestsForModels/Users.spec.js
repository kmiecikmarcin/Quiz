const { expect } = require("chai");
const chai = require("chai");
chai.use(require("sinon-chai"));

const {
  sequelize,
  dataTypes,
  checkModelName,
  checkUniqueIndex,
  checkPropertyExists,
} = require("sequelize-test-helpers");

const UsersModel = require("../../../Models/Users");

describe("../Models/Genders", () => {
  const Users = UsersModel(sequelize, dataTypes);
  const users = new Users();

  checkModelName(Users)("Users");

  context("properties", () => {
    ["id", "email", "password", "accountDeletedStatus"].forEach(
      checkPropertyExists(users)
    );
  });

  context("associations", () => {
    const Genders = "user gender";

    before(() => {
      Users.associate({ Genders });
    });

    it("Defined a belongsTo association with Genders", () => {
      expect(Users.belongsTo).to.have.been.calledWith(Genders);
    });
  });

  context("associations", () => {
    const TypesOfUserRoles = "type of user";

    before(() => {
      Users.associate({ TypesOfUserRoles });
    });

    it("Defined a belongsTo association with TypesOfUserRoles", () => {
      expect(Users.belongsTo).to.have.been.calledWith(TypesOfUserRoles);
    });
  });

  context("indexes", () => {
    ["id_user", "user_email"].forEach(checkUniqueIndex(users));
  });
});
