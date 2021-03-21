const { expect } = require("chai");
const request = require("supertest");
const app = require("../../../app");
const teacherToken = require("./loginAsTeacher.spec");
const dataAboutTopic = require("./POSTtopics.spec");

const topicName = { name_of_topic: dataAboutTopic.name_of_topic };

describe("PUT /topics", () => {
  it("Topic to be deleted", (done) => {
    request(app)
      .put("/quiz/schoolSubjects/topics")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${teacherToken.teacherToken}`)
      .send(topicName)
      .then((res) => {
        expect(res.statusCode).equal(200);
        expect(res.body).to.have.property("Message");
        expect(res.body.Message).equal("Pomyślnie usunięto temat!");
        done();
      });
  });

  it("Try to PUT topic without authorization", (done) => {
    request(app)
      .put("/quiz/schoolSubjects/topics")
      .set("Content-Type", "application/json")
      .set("Authorization", "")
      .send(topicName)
      .then((res) => {
        expect(res.statusCode).equal(403);
        expect(res.body).to.have.property("Error");
        expect(res.body.Error).equal("Błąd uwierzytelniania!");
        done();
      });
  });
});
