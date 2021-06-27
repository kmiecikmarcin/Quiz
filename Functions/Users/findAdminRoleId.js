async function findAdminRoleId(TypesOfUsersRoles) {
  const findId = await TypesOfUsersRoles.findOne({
    where: { name: process.env.S3_ADMIN_PERMISSIONS },
  });
  if (findId !== null) {
    return findId.id;
  }
  return false;
}

module.exports = findAdminRoleId;
