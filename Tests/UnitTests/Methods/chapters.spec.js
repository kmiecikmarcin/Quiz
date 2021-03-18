const { expect } = require("chai");
const request = require("supertest");
const app = require("../../../app");
const userToken = require("./login.spec");
const teacherToken = require("./loginAsTeacher.spec");

const dataAboutChapter = {
  name_of_subject: "Geografia",
  name_of_chapter: `newChapters ${Math.floor(Math.random() * (10000 - 1) + 1)}`,
};

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

describe("POST /chapters", () => {
  it("Create new chapter with teacher permissions", (done) => {
    request(app)
      .post("/quiz/schoolSubjects/chapters")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${teacherToken.teacherToken}`)
      .send(dataAboutChapter)
      .then((res) => {
        expect(res.statusCode).equal(201);
        expect(res.body.Token).to.not.equal(null);
        done();
      });
  });

  it("Create new chapter with common user permissions", (done) => {
    request(app)
      .post("/quiz/schoolSubjects/chapters")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${userToken.token}`)
      .send(dataAboutChapter)
      .then((res) => {
        expect(res.statusCode).equal(400);
        expect(res.body.Token).to.not.equal(null);
        done();
      });
  });
});
