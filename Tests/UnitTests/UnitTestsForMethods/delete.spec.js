const { expect } = require("chai");
const request = require("supertest");
const app = require("../../../app");
const userToken = require("./login.spec");

const authToken = `Bearer ${userToken.token}`;
const inCorrectUserData = {
  user_password: "",
  confirm_password: "",
};

describe("PUT /delete", () => {
  it("Try to delete account wich doesn't exists", (done) => {
    request(app)
      .put("quiz/users/delete")
      .auth(authToken)
      .send(inCorrectUserData)
      .then((res) => {
        done();
      });
  });

  it("Delete exist account", (done) => {});
});
