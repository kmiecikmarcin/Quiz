const { expect } = require("chai");
const request = require("supertest");
const app = require("../../../../app");
const userData = require("./1_register.spec");

const correctUserDataForLogin = {
  user_email: userData.user_email,
  user_password: userData.user_password,
};

const incorrectUserDataForLogin = {
  user_email: "wrongEmail@email.com",
  user_password: "wrongPassword@",
};

const loginResponse = {
  token: "",
};

describe("POST /login", () => {
  it("Login in system with correct data", (done) => {
    request(app)
      .post("/quiz/users/login")
      .send(correctUserDataForLogin)
      .then((res) => {
        expect(res.statusCode).equal(200);
        expect(res.body.messages).to.have.property("token");
        expect(res.body.messages.token).to.not.equal(null);
        loginResponse.token = res.body.messages.token;
        done();
      });
  });

  it("Login with incorrect data", (done) => {
    request(app)
      .post("/quiz/users/login")
      .send(incorrectUserDataForLogin)
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
