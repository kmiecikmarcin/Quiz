const { expect } = require("chai");
const request = require("supertest");
const app = require("../../../../app");
const loginAsAdmin = require("./11_loginAsAdmin.spec");
const userToken = require("./2_login.spec");
const userId = require("./16_GETusers.spec");

describe("DELETE /user", () => {
  it("Delete user by id with admin permissions", (done) => {
    request(app)
      .delete("/quiz/administration/user")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${loginAsAdmin.adminToken}`)
      .send(userId)
      .then((res) => {
        expect(res.statusCode).equal(200);
        expect(res.body.messages.message).equal(
          "Pomyślnie usunięto użytkownika!"
        );
        done();
      });
  });
  it("Delete user by id with user permissions", (done) => {
    request(app)
      .delete("/quiz/administration/user")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${userToken.token}`)
      .send(userId)
      .then((res) => {
        expect(res.statusCode).equal(400);
        expect(res.body.messages.error).equal(
          "Nie posiadasz uprawnień, aby móc usunąć użytkownika!"
        );
        done();
      });
  });
});
