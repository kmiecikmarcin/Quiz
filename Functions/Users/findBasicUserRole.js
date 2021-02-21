async function findBasicUserRole(TypesOfUsersRoles) {
  const findUserRole = await TypesOfUsersRoles.findOne({
    where: { name: process.env.S3_USER_PERMISSIONS },
  });
  if (findUserRole !== null) {
    return findUserRole.id;
  }
  return false;
}

module.exports = findBasicUserRole;
