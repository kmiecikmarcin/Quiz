const { expect } = require("chai");
const request = require("supertest");
const app = require("../../../app");
const userToken = require("./login.spec");
const teacherToken = require("./loginAsTeacher.spec");
const adminToken = require("./loginAsAdmin.spec");

const dataAboutSchoolSubject = {
  new_name_of_school_subject: `newSchoolSubject ${Math.floor(
    Math.random() * (10000 - 1) + 1
  )}`,
};

describe("POST/schoolSubjects", () => {
  it("Create school subject with user permissions", (done) => {});
  it("Create school subject with teacher permissions", (done) => {});
  it("Create school subject with admin permissions", (done) => {});
  it("Create school subject which is in databse", (done) => {});
});
