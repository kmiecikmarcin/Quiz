const bcrypt = require("bcrypt");

async function userDeleteHisAccount(
  Users,
  enteredUserPassword,
  userId,
  userPassword
) {
  const checkPassword = await bcrypt.compare(enteredUserPassword, userPassword);
  if (checkPassword) {
    const tryToDeleteUserAccount = await Users.update(
      { accountDeletedStatus: true },
      { where: { id: userId, password: userPassword } }
    );
    if (tryToDeleteUserAccount.includes(1)) {
      return true;
    }
    return false;
  }
  return false;
}

module.exports = userDeleteHisAccount;
