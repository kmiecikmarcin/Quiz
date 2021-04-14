const { expect } = require("chai");
const request = require("supertest");
const app = require("../../../../app");
const userToken = require("./2_login.spec");
const teacherToken = require("./12_loginAsTeacher.spec");
const adminToken = require("./11_loginAsAdmin.spec");

const dataAboutSchoolSubject = {
  new_name_of_school_subject: `newSchoolSubject${Math.floor(
    Math.random() * (10000 - 1) + 1
  )}`,
};

describe("POST/schoolSubjects", () => {
  it("Create school subject with user permissions", (done) => {
    request(app)
      .post("/quiz/administration/schoolSubject")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${userToken.token}`)
      .send(dataAboutSchoolSubject)
      .then((res) => {
        expect(res.statusCode).equal(400);
        expect(res.body.Token).to.not.equal(null);
        done();
      });
  });
  it("Create school subject with teacher permissions", (done) => {
    request(app)
      .post("/quiz/administration/schoolSubject")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${teacherToken.teacherToken}`)
      .send(dataAboutSchoolSubject)
      .then((res) => {
        expect(res.statusCode).equal(400);
        expect(res.body.Token).to.not.equal(null);
        done();
      });
  });
  it("Create school subject with admin permissions", (done) => {
    request(app)
      .post("/quiz/administration/schoolSubject")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${adminToken.adminToken}`)
      .send(dataAboutSchoolSubject)
      .then((res) => {
        expect(res.statusCode).equal(201);
        expect(res.body.Message).to.not.equal(null);
        done();
      });
  });
  it("Create school subject which is in databse", (done) => {
    request(app)
      .post("/quiz/administration/schoolSubject")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${adminToken.adminToken}`)
      .send(dataAboutSchoolSubject)
      .then((res) => {
        expect(res.statusCode).equal(400);
        expect(res.body.Error).to.not.equal(null);
        done();
      });
  });
});
