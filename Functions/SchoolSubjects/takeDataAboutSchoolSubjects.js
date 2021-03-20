async function takeDataAboutSchoolSubjects(Subjects) {
  const takeAll = await Subjects.findAll({
    raw: true,
    attributes: { exclude: ["id", "createdAt", "updatedAt"] },
  });
  if (takeAll.length !== 0) {
    return takeAll;
  }
  return false;
}

module.exports = takeDataAboutSchoolSubjects;
