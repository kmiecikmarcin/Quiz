const { expect } = require("chai");
const request = require("supertest");
const app = require("../../../../app");
const dataAboutTopic = require("./7_POSTtopics.spec");

const topicName = { name_of_topic: dataAboutTopic.name_of_topic };

describe("PUT /topics", () => {
  it("Try to PUT topic without authorization", (done) => {
    request(app)
      .put("/quiz/schoolSubjects/remove-topic")
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
