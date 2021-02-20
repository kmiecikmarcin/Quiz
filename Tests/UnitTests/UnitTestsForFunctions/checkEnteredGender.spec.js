const { assert } = require("chai");
const checkEnteredGender = require("../../../Functions/Others/checkEnteredGender");

describe("Check entered gender data", () => {
  it("Entered data should be Kobieta", () => {
    assert.equal(checkEnteredGender("Kobieta"), "Kobieta");
  });

  it("Entered data should be Mężczyzna", () => {
    assert.equal(checkEnteredGender("Mężczyzna"), "Mężczyzna");
  });

  it("Entered data should be Inna", () => {
    assert.equal(checkEnteredGender("Inna"), "Inna");
  });

  it("Return data wchich is string", () => {
    const result = checkEnteredGender("Inna");
    assert.typeOf(result, "string");
  });

  it("Without entered data", () => {
    const result = checkEnteredGender(false);
    assert.typeOf(result, "boolean");
  });
});
