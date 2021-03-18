const { expect } = require("chai");
const request = require("supertest");
const app = require("../../../app");

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
        expect(res.body).to.have.property("Token");
        expect(res.body.Token).to.not.equal(null);
        loginResponse.teacherToken = res.body.Token;
        done();
      });
  });

  it("Login with incorrect data", (done) => {
    request(app)
      .post("/quiz/users/login")
      .send(incorrectUserDataForLogin)
      .then((res) => {
        expect(res.statusCode).equal(400);
        expect(res.body).to.have.property("Error");
        expect(res.body.Error).equal("Wprowadzony adress e-mail nie istnieje!");
        done();
      });
  });
});

module.exports = loginResponse;
