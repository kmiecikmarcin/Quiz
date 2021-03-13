const { expect } = require("chai");
const request = require("supertest");
const app = require("../../../app");
const userToken = require("./email.spec");
const userData = require("./register.spec");

const newRandomUserPassword = `newPassword${Math.floor(
  Math.random() * (10000 - 1) + 1
)}@`;

const correctUserData = {
  new_user_password: newRandomUserPassword,
  confirm_new_user_password: newRandomUserPassword,
  user_password: userData.user_password,
};

describe("PUT /password", () => {
  it("Correct change of user password", (done) => {
    request(app)
      .put("/quiz/users/password")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${userToken.token}`)
      .send(correctUserData)
      .then((res) => {
        expect(res.statusCode).equal(200);
        expect(res.body).to.have.property("Token");
        expect(res.body.Token).to.not.equal(null);
        done();
      });
  });

  it("Try to change password without created account", (done) => {
    request(app)
      .put("/quiz/users/password")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${userToken.token}`)
      .send(correctUserData)
      .then((res) => {
        expect(res.statusCode).equal(400);
        expect(res.body).to.have.property("Error");
        expect(res.body.Error).equal(
          "Wprowadzone aktualne hasło jest nieprawidłowe. Sprawdź wprowadzone dane!"
        );
        done();
      });
  });

  it("Try to change data without authorization", (done) => {
    request(app)
      .put("/quiz/users/password")
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
