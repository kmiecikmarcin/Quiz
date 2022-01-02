async function checkThatEmailIsUnique(Users, userEmail) {
  const checkEmail = await Users.findOne({
    where: { user_email: userEmail, accountToBeDeleted: false },
  });
  if (checkEmail !== null) {
    return false;
  }
  return true;
}

module.exports = checkThatEmailIsUnique;
