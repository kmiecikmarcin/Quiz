const { assert } = require("chai");
const checkPasswordAboutOneSpecialKey = require("../../../Functions/Others/checkPasswordAboutOneSpecialKey");

describe("Check if it password has special key", () => {
  it("Password doesn't have special key", () => {
    assert.equal(checkPasswordAboutOneSpecialKey("randomPassword"), false);
  });

  it("Password has special key", () => {
    assert.equal(checkPasswordAboutOneSpecialKey("randomPassword@"), true);
  });

  it("Return data wchich is boolean", () => {
    const result = checkPasswordAboutOneSpecialKey(true);
    assert.typeOf(result, "boolean");
  });
});
