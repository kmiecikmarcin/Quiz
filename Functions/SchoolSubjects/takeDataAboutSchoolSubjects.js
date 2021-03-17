async function takeDataAboutSchoolSubjects(Model) {
  const takeAll = await Model.findAll({
    raw: true,
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });
  if (takeAll !== null) {
    return takeAll;
  }
  return false;
}

module.exports = takeDataAboutSchoolSubjects;
