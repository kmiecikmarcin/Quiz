const { expect } = require("chai");
const request = require("supertest");
const app = require("../../../app");
const userToken = require("./password.spec");
const teacherToken = require("./loginAsTeacher.spec");
const nameOfChapter = require("./chapters.spec");

const dataAboutTopic = {
  name_of_chapter: nameOfChapter.name_of_chapter,
  name_of_topic: `newTopic ${Math.floor(Math.random() * (10000 - 1) + 1)}`,
};

describe("GET /topics", () => {
  it("Take all topics", (done) => {
    request(app)
      .get("/quiz/schoolSubjects/topics")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${userToken.token}`)
      .then((res) => {
        expect(res.statusCode).equal(200);
        expect(res.body.Token).to.not.equal(null);
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
        expect(res.body.Token).to.not.equal(null);
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
        expect(res.body).to.have.property("Error");
        expect(res.body.Error).equal("Błąd uwierzytelniania!");
        done();
      });
  });
});

describe("POST /topics", () => {
  it("Create new topic with teacher permissions", (done) => {
    request(app)
      .post("/quiz/schoolSubjects/topics")
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
      .post("/quiz/schoolSubjects/chapters")
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
