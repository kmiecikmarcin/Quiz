const { expect } = require("chai");
const request = require("supertest");
const app = require("../../../../app");
const userToken = require("./2_login.spec");
const teacherToken = require("./12_loginAsTeacher.spec");
const nameOfChapter = require("./6_POSTchapters.spec");

const dataAboutTopic = {
  name_of_chapter: nameOfChapter.name_of_chapter,
  name_of_topic: `newTopic ${Math.floor(Math.random() * (10000 - 1) + 1)}`,
};

describe("POST /topics", () => {
  it("Create new topic with teacher permissions", (done) => {
    request(app)
      .post("/quiz/schoolSubjects/topic")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${teacherToken.teacherToken}`)
      .send(dataAboutTopic)
      .then((res) => {
        expect(res.statusCode).equal(201);
        expect(res.body.Token).to.not.equal(null);
        done();
      });
  });

  it("Create new topic with common user permissions", (done) => {
    request(app)
      .post("/quiz/schoolSubjects/topic")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${userToken.token}`)
      .send(dataAboutTopic)
      .then((res) => {
        expect(res.statusCode).equal(400);
        expect(res.body.Token).to.not.equal(null);
        done();
      });
  });
});

module.exports = dataAboutTopic;
