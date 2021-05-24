const { expect } = require("chai");
const request = require("supertest");
const app = require("../../../../app");
const adminToken = require("./11_loginAsAdmin.spec");
const userToken = require("./2_login.spec");

describe("GET /users", () => {
  it("Take list of users with admin permissions", (done) => {
    request(app)
      .get("/quiz/administration/users")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${adminToken.adminToken}`)
      .then((res) => {
        expect(res.statusCode).equal(200);
        expect(res.body.listOfUsers).to.not.equal(null);
        done();
      });
  });

  it("Take list of users with user permissions", (done) => {
    request(app)
      .get("/quiz/administration/users")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${userToken.token}`)
      .then((res) => {
        expect(res.statusCode).equal(400);
        expect(res.body.messages.error).equal("Nie posiadasz uprawnień!");
        done();
      });
  });
});
