const { expect } = require("chai");
const request = require("supertest");
const app = require("../../../app");
const userToken = require("./login.spec");
const teacherToken = require("./loginAsTeacher.spec");

describe("GET /chapters", () => {
  it("Take all chapters", (done) => {
    request(app)
      .get("/quiz/schoolSubjects/chapters")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${userToken.token}`)
      .then((res) => {
        expect(res.statusCode).equal(200);
        expect(res.body.Token).to.not.equal(null);
        done();
      });
  });

  it("Take all chapter with teacher permissions teacher", (done) => {
    request(app)
      .get("/quiz/schoolSubjects/chapters")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${teacherToken.teacherToken}`)
      .then((res) => {
        expect(res.statusCode).equal(200);
        expect(res.body.Token).to.not.equal(null);
        done();
      });
  });

  it("Try to take chapters without authorization", (done) => {
    request(app)
      .get("/quiz/schoolSubjects/chapters")
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
