const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function generateToken(
  enteredPassword,
  userId,
  userPassword,
  userEmail,
  nameOfEntitlement
) {
  let token;
  const match = await bcrypt.compare(enteredPassword, userPassword);
  if (match) {
    token = jwt.sign(
      {
        id: userId,
        email: userEmail,
        name: nameOfEntitlement,
      },
      process.env.S3_SECRETKEY,
      { expiresIn: "36h" }
    );
    return token;
  }
  return false;
}

module.exports = generateToken;
