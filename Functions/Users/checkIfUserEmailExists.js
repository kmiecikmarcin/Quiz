const responseData = {
  userId: null,
  userRoleId: null,
};

async function checkIfUserEmailExists(Users, userEmail) {
  const checkUserAdressEmail = await Users.findOne({ email: userEmail });
  if (checkUserAdressEmail !== null) {
    responseData.userId = checkUserAdressEmail.id;
    responseData.userRoleId = checkUserAdressEmail.TypesOfUsersRoleId;
    return responseData;
  }
  return false;
}

module.exports = checkIfUserEmailExists;
