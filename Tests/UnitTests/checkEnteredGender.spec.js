const { assert } = require("chai");
const checkEnteredGender = require("../../Functions/Others/checkEnteredGender");

describe("Check entered gender data", () => {
  it("Entered data should be Kobieta", () => {
    assert.equal(checkEnteredGender("Kobieta"), "Kobieta");
  });
});
