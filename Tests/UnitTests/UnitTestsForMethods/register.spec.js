const { expect } = require("chai");
const request = require("supertest");
const app = require("../../../app");

describe("POST /register", () => {
  const randomUserEmail = `user${Math.floor(
    Math.random() * (10000 - 1) + 1
  )}@exampleEmail.com`;

  it("Create new user account", (done) => {
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
        expect(res.statusCode).equal(201);
        expect(res.body.Message).equal("Rejestracja przebiegła pomyślnie!");
        done();
      });
  });
});
