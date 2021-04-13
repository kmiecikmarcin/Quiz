const { expect } = require("chai");
const request = require("supertest");
const app = require("../../../../app");
const userToken = require("./2_login.spec");
const teacherToken = require("./12_loginAsTeacher.spec");

describe("GET /subjects", () => {
  it("Take all subjects as common user", (done) => {
    request(app)
      .get("/quiz/schoolSubjects/subjects")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${userToken.token}`)
      .then((res) => {
        expect(res.statusCode).equal(200);
        expect(res.body.Token).to.not.equal(null);
        done();
      });
  });

  it("Take all subjects as teacher permissions", (done) => {
    request(app)
      .get("/quiz/schoolSubjects/subjects")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${teacherToken.teacherToken}`)
      .then((res) => {
        expect(res.statusCode).equal(200);
        expect(res.body.Token).to.not.equal(null);
        done();
      });
  });

  it("Try to take subjects without authorization", (done) => {
    request(app)
      .get("/quiz/schoolSubjects/subjects")
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
