async function findUserRoleById(TypesOfUsersRoles, userRoleId) {
  const findUserRole = await TypesOfUsersRoles.findOne({
    where: { id: userRoleId },
  });
  if (findUserRole !== null) {
    return findUserRole.name;
  }
  return false;
}

module.exports = findUserRoleById;
