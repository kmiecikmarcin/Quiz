const { expect } = require("chai");
const request = require("supertest");
const app = require("../../../../app");
const userToken = require("./2_login.spec");
const teacherToken = require("./12_loginAsTeacher.spec");
const dataAboutChapter = require("./6_POSTchapters.spec");

const chapterName = { name_of_chapter: dataAboutChapter.name_of_chapter };

describe("PUT /chapters", () => {
  it("Chapter to be deleted", (done) => {
    request(app)
      .put("/quiz/schoolSubjects/update-chapter")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${teacherToken.teacherToken}`)
      .send(chapterName)
      .then((res) => {
        expect(res.statusCode).equal(400);
        expect(res.body).to.have.property("Error");
        expect(res.body.Error).equal(
          "Rozdział posiada przypisane do siebie tematy."
        );
        done();
      });
  });

  it("Try to PUT chapter without authorization", (done) => {
    request(app)
      .put("/quiz/schoolSubjects/update-chapter")
      .set("Content-Type", "application/json")
      .set("Authorization", "")
      .send(chapterName)
      .then((res) => {
        expect(res.statusCode).equal(403);
        expect(res.body).to.have.property("Error");
        expect(res.body.Error).equal("Błąd uwierzytelniania!");
        done();
      });
  });

  it("Try to PUT chapter with common user permissions", (done) => {
    request(app)
      .put("/quiz/schoolSubjects/update-chapter")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${userToken.token}`)
      .send(chapterName)
      .then((res) => {
        expect(res.statusCode).equal(400);
        expect(res.body.Token).to.not.equal(null);
        done();
      });
  });
});
