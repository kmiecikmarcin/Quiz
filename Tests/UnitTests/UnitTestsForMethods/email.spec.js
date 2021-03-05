const { expect } = require("chai");
const request = require("supertest");
const app = require("../../../app");
const userToken = require("./login.spec");
const userData = require("./register.spec");

const newRandomUserEmail = `user${Math.floor(
  Math.random() * (10000 - 1) + 1
)}@exampleEmail.com`;

const correctUserData = {
  new_user_email: newRandomUserEmail,
  user_password: userData.user_password,
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
        done();
      });
  });
});
