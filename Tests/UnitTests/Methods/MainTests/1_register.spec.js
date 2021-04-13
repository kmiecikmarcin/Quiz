const { expect } = require("chai");
const request = require("supertest");
const app = require("../../../../app");

const randomUserEmail = `user${Math.floor(
  Math.random() * (10000 - 1) + 1
)}@exampleEmail.com`;

const userData = {
  user_email: randomUserEmail,
  user_password: "userPassword@",
  confirm_password: "userPassword@",
  user_gender: "Kobieta",
  user_verification: true,
};

describe("POST /register", () => {
  it("Create new user account", (done) => {
    request(app)
      .post("/quiz/users/register")
      .send(userData)
      .then((res) => {
        expect(res.statusCode).equal(201);
        expect(res.body.Message).equal("Rejestracja przebiegła pomyślnie!");
        done();
      });
  });

  it("Create user account with existing email in system", (done) => {
    request(app)
      .post("/quiz/users/register")
      .send({
        user_email: randomUserEmail,
        user_password: "userPassword@",
        confirm_password: "userPassword@",
        user_gender: "Kobieta",
        user_verification: true,
      })
      .then((res) => {
        expect(res.statusCode).equal(400);
        expect(res.body.Error).equal(
          "Wprowadzony adres e-mail istnieje w systemie!"
        );
        done();
      });
  });

  it("Create user account with incorrect gender data", (done) => {
    request(app)
      .post("/quiz/users/register")
      .send({
        user_email: randomUserEmail,
        user_password: "userPassword@",
        confirm_password: "userPassword@",
        user_gender: "badGender",
        user_verification: true,
      })
      .then((res) => {
        expect(res.statusCode).equal(400);
        expect(res.body.user_gender.msg).equal("Podano błędną wartość!");
        done();
      });
  });
});

module.exports = userData;
