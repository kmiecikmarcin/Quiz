const { expect } = require("chai");
const request = require("supertest");
const app = require("../../../../app");
const userToken = require("../MainTests/2_login.spec");
const userData = require("../MainTests/1_register.spec");

const newRandomUserEmail = `user${Math.floor(
  Math.random() * (10000 - 1) + 1
)}@exampleEmail.com`;

const correctUserData = {
  new_user_email: newRandomUserEmail,
  user_password: userData.user_password,
};

const response = {
  token: "",
};

describe("PUT /email", () => {
  it("Correct change of e-mail", (done) => {
    request(app)
      .put("/quiz/users/email")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${userToken.token}`)
      .send(correctUserData)
      .then((res) => {
        expect(res.statusCode).equal(200);
        expect(res.body).to.have.property("Token");
        expect(res.body.Token).to.not.equal(null);
        response.token = res.body.Token;
        done();
      });
  });

  it("Try to change e-mail without created account", (done) => {
    request(app)
      .put("/quiz/users/email")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${userToken.token}`)
      .send(correctUserData)
      .then((res) => {
        expect(res.statusCode).equal(400);
        expect(res.body).to.have.property("Error");
        expect(res.body.Error).equal("Użytkownik nie istnieje!");
        done();
      });
  });

  it("Try to change data without authorization", (done) => {
    request(app)
      .put("/quiz/users/email")
      .set("Content-Type", "application/json")
      .set("Authorization", "")
      .send(correctUserData)
      .then((res) => {
        expect(res.statusCode).equal(403);
        expect(res.body).to.have.property("Error");
        expect(res.body.Error).equal("Błąd uwierzytelniania!");
        done();
      });
  });
});

module.exports = response;
