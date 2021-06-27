async function findUserById(Users, userId) {
  const findUser = await Users.findOne({ where: { id: userId } });
  if (findUser !== null) {
    return true;
  }
  return false;
}

module.exports = findUserById;
