const { expect } = require("chai");
const request = require("supertest");
const app = require("../../../../app");

const correctUserDataForLogin = {
  user_email: "teacher@example.com",
  user_password: "teacher@",
};

const incorrectUserDataForLogin = {
  user_email: "wrongEmail@email.com",
  user_password: "wrongPassword@",
};

const loginResponse = {
  teacherToken: "",
};

describe("POST /login", () => {
  it("Login in system as teacher", (done) => {
    request(app)
      .post("/quiz/users/login")
      .send(correctUserDataForLogin)
      .then((res) => {
        expect(res.statusCode).equal(200);
        expect(res.body.messages).to.have.property("token");
        expect(res.body.messages.token).to.not.equal(null);
        loginResponse.teacherToken = res.body.messages.token;
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
