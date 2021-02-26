const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function userTryToLogin(
  enteredPasswordByUser,
  userId,
  userEmail,
  userPassword,
  nameOfRole
) {
  const match = await bcrypt.compare(enteredPasswordByUser, userPassword);
  if (match) {
    const token = jwt.sign(
      {
        id: userId,
        email: userEmail,
        name: nameOfRole,
      },
      process.env.S3_SECRETKEY,
      { expiresIn: "36h" }
    );
    return token;
  }
  return false;
}
module.exports = userTryToLogin;
