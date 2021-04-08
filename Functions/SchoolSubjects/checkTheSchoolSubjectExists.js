async function checkTheSchoolSubjectExists(
  SchoolSubjects,
  enteredSchoolSubject
) {
  const findSchoolSubject = await SchoolSubjects.findOne({
    where: { name: enteredSchoolSubject },
  });
  if (findSchoolSubject !== null) {
    return findSchoolSubject.id;
  }
  return false;
}

module.exports = checkTheSchoolSubjectExists;
