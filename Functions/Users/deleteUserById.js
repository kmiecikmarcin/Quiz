async function deleteUserById(Users, userId) {
  const deleteUser = await Users.destroy({
    where: { id: userId, accountToBeDeleted: true },
  });
  if (deleteUser !== null) {
    return true;
  }
  return false;
}

module.exports = deleteUserById;
