const responseData = {
  userId: null,
  userRoleId: null,
};

async function checkThatAccountWithEnteredEmailExists(Users, userEmail) {
  const checkUserAdressEmail = await Users.findOne({
    where: { email: userEmail, accountToBeDeleted: false },
  });
  if (checkUserAdressEmail !== null) {
    responseData.userId = checkUserAdressEmail.id;
    responseData.userRoleId = checkUserAdressEmail.TypesOfUsersRoleId;
    return responseData;
  }
  return false;
}

module.exports = checkThatAccountWithEnteredEmailExists;
