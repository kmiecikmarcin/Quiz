async function userData(Users, userId) {
  const userData = await Users.findOne({
    where: { id: userId },
  });
  if (userData !== null) {
    return userData;
  }
  return false;
}

module.exports = userData;
