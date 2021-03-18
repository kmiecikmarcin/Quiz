const { expect } = require("chai");
const request = require("supertest");
const app = require("../../../app");
const userToken = require("./password.spec");

describe("GET /subjects", () => {
  it("Take all subjects", (done) => {
    request(app)
      .get("/quiz/schoolSubcjects/subjects")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${userToken.token}`)
      .then((res) => {
        expect(res.statusCode).equal(200);
        expect(res.body.Token).to.not.equal(null);
        done();
      });
  });

  it("Try to take subjects without authorization", (done) => {
    request(app)
      .get("/quiz/schoolSubcjects/subjects")
      .set("Content-Type", "application/json")
      .set("Authorization", "")
      .then((res) => {
        expect(res.statusCode).equal(403);
        expect(res.body).to.have.property("Error");
        expect(res.body.Error).equal("Błąd uwierzytelniania!");
        done();
      });
  });
});
