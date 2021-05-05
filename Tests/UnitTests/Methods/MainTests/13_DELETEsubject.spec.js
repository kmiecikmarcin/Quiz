const { expect } = require("chai");
const request = require("supertest");
const app = require("../../../../app");
const loginAsAdmin = require("./11_loginAsAdmin.spec");
const dataAboutSchoolSubject = require("./10_POSTschoolSubjects.spec");

const nameOfSubject = {
  name_of_school_subject: dataAboutSchoolSubject.name_of_school_subject,
};

describe("DELETE /subjects", () => {
  it("Delete subject", (done) => {
    request(app)
      .delete("/quiz/administration/subject")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${loginAsAdmin.adminToken}`)
      .send(nameOfSubject)
      .then((res) => {
        expect(res.statusCode).equal(200);
        expect(res.body.messages.message).equal(
          "Pomyślnie usunięto przedmiot szkolny!"
        );
        done();
      });
  });
});
