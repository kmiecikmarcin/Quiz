async function updateUserPermissionToTeacherPermissions(
  Users,
  typesOfUsersRoleId,
  userId
) {
  const updatePermission = await Users.update(
    { TypesOfUsersRoleId: typesOfUsersRoleId },
    { where: { id: userId } }
  );
  if (updatePermission.includes(1)) {
    return true;
  }
  return false;
}

module.exports = updateUserPermissionToTeacherPermissions;
