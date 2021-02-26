async function findUserRoleById(TypesOfUsersRoles, userRoleId) {
  const findUserRole = TypesOfUsersRoles.findOne({ id: userRoleId });
  if (findUserRole !== null) {
    return findUserRole.name;
  }
  return false;
}

module.exports = findUserRoleById;
