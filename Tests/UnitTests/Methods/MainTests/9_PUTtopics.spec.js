const { expect } = require("chai");
const request = require("supertest");
const app = require("../../../../app");
const teacherToken = require("./12_loginAsTeacher.spec");
const dataAboutTopic = require("./7_POSTtopics.spec");

const topicName = { name_of_topic: dataAboutTopic.name_of_topic };

describe("PUT /topics", () => {
  it("Topic to be deleted", (done) => {
    request(app)
      .put("/quiz/schoolSubjects/update-topic")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${teacherToken.teacherToken}`)
      .send(topicName)
      .then((res) => {
        expect(res.statusCode).equal(200);
        expect(res.body.messages).to.have.property("message");
        expect(res.body.messages.message).equal("Pomyślnie usunięto temat!");
        done();
      });
  });

  it("Try to PUT topic without authorization", (done) => {
    request(app)
      .put("/quiz/schoolSubjects/update-topic")
      .set("Content-Type", "application/json")
      .set("Authorization", "")
      .send(topicName)
      .then((res) => {
        expect(res.statusCode).equal(403);
        expect(res.body.messages).to.have.property("error");
        expect(res.body.messages.error).equal("Błąd uwierzytelniania!");
        done();
      });
  });
});
