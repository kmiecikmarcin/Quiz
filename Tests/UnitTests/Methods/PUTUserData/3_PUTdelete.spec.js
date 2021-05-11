const { expect } = require("chai");
const request = require("supertest");
const app = require("../../../../app");
const userData = require("./2_PUTpassword.spec");

const correctUserData = {
  user_password: userData.user_password,
  confirm_password: userData.user_password,
};

describe("PUT /delete", () => {
  it("Try to delete account without token", (done) => {
    request(app)
      .put("/quiz/users/delete")
      .set("Content-Type", "application/json")
      .set("Authorization", "")
      .send(correctUserData)
      .then((res) => {
        expect(res.statusCode).equal(403);
        expect(res.body.messages).to.have.property("error");
        expect(res.body.messages.error).equal("Błąd uwierzytelniania!");
        done();
      });
  });

  it("Delete exist account", (done) => {
    request(app)
      .put("/quiz/users/delete")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${userData.token}`)
      .send(correctUserData)
      .then((res) => {
        expect(res.statusCode).equal(200);
        expect(res.body.messages).to.have.property("message");
        expect(res.body.messages.message).equal("Pomyślnie usunięto konto!");
        done();
      });
  });
});
