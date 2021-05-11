const { expect } = require("chai");
const request = require("supertest");
const app = require("../../../../app");

const correctAdminDataForLogin = {
  user_email: "admin@example.com",
  user_password: "admin@",
};

const incorrectAdminDataForLogin = {
  user_email: "wrongEmail@email.com",
  user_password: "wrongPassword@",
};

const loginResponse = {
  adminToken: "",
};

describe("POST /login", () => {
  it("Login in system as admin", (done) => {
    request(app)
      .post("/quiz/users/login")
      .send(correctAdminDataForLogin)
      .then((res) => {
        expect(res.statusCode).equal(200);
        expect(res.body.messages).to.have.property("token");
        expect(res.body.messages.token).to.not.equal(null);
        loginResponse.adminToken = res.body.messages.token;
        done();
      });
  });

  it("Login as admin with incorrect data", (done) => {
    request(app)
      .post("/quiz/users/login")
      .send(incorrectAdminDataForLogin)
      .then((res) => {
        expect(res.statusCode).equal(400);
        expect(res.body.messages).to.have.property("error");
        expect(res.body.messages.error).equal(
          "Wprowadzony adress e-mail nie istnieje!"
        );
        done();
      });
  });
});

module.exports = loginResponse;
