async function takeAllSchoolSubjects(SchoolSubjects) {
  const takeSubjects = await SchoolSubjects.findAll({
    raw: true,
    attributes: ["name"],
  });
  if (takeSubjects !== null) {
    return takeSubjects;
  }
  return false;
}

module.exports = takeAllSchoolSubjects;
