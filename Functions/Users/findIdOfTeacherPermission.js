async function findIdOfTeacherPermission(TypesOfUsersRoles) {
  const findId = await TypesOfUsersRoles.findOne({
    where: { name: process.env.S3_TEACHER_PERMISSIONS },
  });
  if (findId !== null) {
    return findId.id;
  }
  return false;
}

module.exports = findIdOfTeacherPermission;
