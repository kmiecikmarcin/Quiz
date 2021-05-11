const { expect } = require("chai");
const request = require("supertest");
const app = require("../../../../app");
const loginAsAdmin = require("./11_loginAsAdmin.spec");
const topicName = require("./7_POSTtopics.spec");

const nameOfTopic = { name_of_topic: topicName.name_of_topic };

describe("DELETE /topic", () => {
  it("Delete topic", (done) => {
    request(app)
      .delete("/quiz/administration/topic")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${loginAsAdmin.adminToken}`)
      .send(nameOfTopic)
      .then((res) => {
        expect(res.statusCode).equal(200);
        expect(res.body.messages.message).equal("Pomyślnie usunięto temat!");
        done();
      });
  });
});
