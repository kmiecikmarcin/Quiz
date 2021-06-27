async function takeListOfUsersWhichAreToRemove(Users) {
  const takeListOfUsers = await Users.findAll({
    where: { accountToBeDeleted: true },
    attributes: { exclude: ["password"] },
  });
  if (takeListOfUsers !== null && Object.keys(takeListOfUsers) !== 0) {
    return takeListOfUsers;
  }
  return false;
}

module.exports = takeListOfUsersWhichAreToRemove;
