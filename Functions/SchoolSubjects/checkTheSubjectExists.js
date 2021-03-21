async function checkTheSubjectExists(Subjects, enteredSubject) {
  const findSubject = await Subjects.findOne({
    where: { name: enteredSubject },
  });
  if (findSubject !== null) {
    return findSubject.id;
  }
  return false;
}

module.exports = checkTheSubjectExists;
