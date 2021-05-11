const { expect } = require("chai");
const request = require("supertest");
const app = require("../../../../app");
const userToken = require("./2_login.spec");
const dataAboutChapter = require("./6_POSTchapters.spec");

const chapterName = { name_of_chapter: dataAboutChapter.name_of_chapter };

describe("PUT /chapters", () => {
  it("Try to PUT chapter without authorization", (done) => {
    request(app)
      .put("/quiz/schoolSubjects/remove-chapter")
      .set("Content-Type", "application/json")
      .set("Authorization", "")
      .send(chapterName)
      .then((res) => {
        expect(res.statusCode).equal(403);
        expect(res.body.messages).to.have.property("error");
        expect(res.body.messages.error).equal("Błąd uwierzytelniania!");
        done();
      });
  });

  it("Try to PUT chapter with common user permissions", (done) => {
    request(app)
      .put("/quiz/schoolSubjects/remove-chapter")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${userToken.token}`)
      .send(chapterName)
      .then((res) => {
        expect(res.statusCode).equal(400);
        expect(res.body.messages.error).to.not.equal(null);
        done();
      });
  });
});

module.exports = chapterName;
