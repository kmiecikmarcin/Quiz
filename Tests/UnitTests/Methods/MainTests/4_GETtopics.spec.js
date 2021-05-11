const { expect } = require("chai");
const request = require("supertest");
const app = require("../../../../app");
const userToken = require("./2_login.spec");
const teacherToken = require("./12_loginAsTeacher.spec");

describe("GET /topics", () => {
  it("Take all topics", (done) => {
    request(app)
      .get("/quiz/schoolSubjects/topics")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${userToken.token}`)
      .then((res) => {
        expect(res.statusCode).equal(200);
        expect(res.body.chapters).to.not.equal(null);
        done();
      });
  });

  it("Take all topics with teacher permissions", (done) => {
    request(app)
      .get("/quiz/schoolSubjects/topics")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${teacherToken.teacherToken}`)
      .then((res) => {
        expect(res.statusCode).equal(200);
        expect(res.body.chapters).to.not.equal(null);
        done();
      });
  });

  it("Try to take topics without authorization", (done) => {
    request(app)
      .get("/quiz/schoolSubjects/topics")
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
