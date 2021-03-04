async function changeUserEmailAdress(
  Users,
  userId,
  userEmail,
  userPassword,
  enteredPasswordByUser,
  newUserEmail
) {
  const checkPassword = await bcrypt.compare(
    enteredPasswordByUser,
    userPassword
  );
  if (checkPassword) {
    const updateUserEmail = await Users.update(
      { email: newUserEmail },
      { where: { id: userId, email: userEmail } }
    );
    if (updateUserEmail.includes(1)) {
      return true;
    }
    return false;
  }
  return false;
}

module.exports = changeUserEmailAdress;
