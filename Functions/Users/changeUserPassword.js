async function changeUserPassword(
  Users,
  userId,
  userEmail,
  userPassword,
  enteredPasswordByUser,
  newUserPassword
) {
  const checkPassword = await bcrypt.compare(
    enteredPasswordByUser,
    userPassword
  );
  if (checkPassword) {
    const hash = await bcrypt.hash(newUserPassword, 8);
    if (hash) {
      const changeUserPassword = await Users.update(
        { password: hash },
        { where: { id: userId, email: userEmail } }
      );
      if (changeUserPassword.includes(1)) {
        return changeUserPassword;
      }
      return false;
    }
    return false;
  }
  return false;
}

module.exports = changeUserPassword;
