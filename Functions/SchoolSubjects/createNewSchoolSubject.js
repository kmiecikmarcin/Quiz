async function createNewSchoolSubject(SchoolSubjects, newNameOfSchoolSubject) {
  const addNewSchoolSubjects = await SchoolSubjects.create({
    name: newNameOfSchoolSubject,
  });
  if (addNewSchoolSubjects !== null) {
    return true;
  }
  return false;
}

module.exports = createNewSchoolSubject;
