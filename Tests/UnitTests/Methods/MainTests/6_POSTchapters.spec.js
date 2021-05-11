const { expect } = require("chai");
const request = require("supertest");
const app = require("../../../../app");
const userToken = require("./2_login.spec");
const teacherToken = require("./12_loginAsTeacher.spec");

const dataAboutChapter = {
  name_of_subject: "Geografia",
  name_of_chapter: `newChapters ${Math.floor(Math.random() * (10000 - 1) + 1)}`,
};

describe("POST /chapter", () => {
  it("Create new chapter with teacher permissions", (done) => {
    request(app)
      .post("/quiz/schoolSubjects/chapter")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${teacherToken.teacherToken}`)
      .send(dataAboutChapter)
      .then((res) => {
        expect(res.statusCode).equal(201);
        expect(res.body.messages.message).to.not.equal(null);
        done();
      });
  });

  it("Create new chapter with common user permissions", (done) => {
    request(app)
      .post("/quiz/schoolSubjects/chapter")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${userToken.token}`)
      .send(dataAboutChapter)
      .then((res) => {
        expect(res.statusCode).equal(400);
        expect(res.body.messages.error).to.not.equal(null);
        done();
      });
  });
});

module.exports = dataAboutChapter;
