async function checkIfEmailIsUnique(Users, userEmail) {
  const checkEmail = await Users.findOne({
    where: { user_email: userEmail, accountDeletedStatus: false },
  });
  if (checkEmail !== null) {
    return false;
  }
  return true;
}

module.exports = checkIfEmailIsUnique;
