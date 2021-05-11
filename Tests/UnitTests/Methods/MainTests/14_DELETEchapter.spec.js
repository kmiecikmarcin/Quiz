const { expect } = require("chai");
const request = require("supertest");
const app = require("../../../../app");
const loginAsAdmin = require("./11_loginAsAdmin.spec");
const chapterName = require("./8_PUTchapters.spec");

const nameOfChapter = { name_of_chapter: chapterName.name_of_chapter };

describe("DELETE /chapter", () => {
  it("Delete chapter", (done) => {
    request(app)
      .delete("/quiz/administration/chapter")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${loginAsAdmin.adminToken}`)
      .send(nameOfChapter)
      .then((res) => {
        expect(res.statusCode).equal(200);
        expect(res.body.messages.message).equal("Pomyślnie usunięto rozdział!");
        done();
      });
  });
});
