const { expect } = require("chai");
const request = require("supertest");
const app = require("../../../../app");
const teacherToken = require("./12_loginAsTeacher.spec");

describe("GET /chapters", () => {
  it("Take all chapter with teacher permissions teacher", (done) => {
    request(app)
      .get("/quiz/schoolSubjects/chapters")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${teacherToken.teacherToken}`)
      .then((res) => {
        expect(res.statusCode).equal(200);
        expect(res.body.topics).to.not.equal(null);
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
        expect(res.body.messages).to.have.property("error");
        expect(res.body.messages.error).equal("Błąd uwierzytelniania!");
        done();
      });
  });
});
