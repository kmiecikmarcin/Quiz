const { assert } = require("chai");
const checkUserVerification = require("../../../Functions/Others/checkUserVerification");

describe("Check user verification", () => {
  it("Verification is false", () => {
    assert.equal(checkUserVerification(false), false);
  });

  it("Verification is true", () => {
    assert.equal(checkUserVerification(true), true);
  });

  it("Return data wchich is boolean", () => {
    const result = checkUserVerification(false);
    assert.typeOf(result, "boolean");
  });
});
