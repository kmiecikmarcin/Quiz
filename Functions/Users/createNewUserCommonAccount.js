const bcrypt = require("bcrypt");

async function createNewUserCommonAccount(
  Users,
  userEmail,
  userPassword,
  idUserRole,
  genderId
) {
  const hash = await bcrypt.hash(userPassword, 8);

  const createUserAccount = await Users.create({
    email: userEmail,
    password: hash,
    accountToBeDeleted: false,
    TypesOfUsersRoleId: idUserRole,
    GenderId: genderId,
  });
  if (createUserAccount !== null) {
    return true;
  }
  return false;
}

module.exports = createNewUserCommonAccount;
