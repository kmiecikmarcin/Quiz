async function takeDataAboutSchoolSubjects(Model) {
  const takeAll = await Model.findAll({
    raw: true,
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });
  if (takeAll.length !== 0) {
    return takeAll;
  }
  return false;
}

module.exports = takeDataAboutSchoolSubjects;
