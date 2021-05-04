const findChapterBySchoolSubjectId = require("./findChapterBySchoolSubjectId");

async function removeSchoolSubjectFromDatabase(
  res,
  SchoolSubjects,
  Chapters,
  nameOfSchoolSubjects,
  idSchoolSubject
) {
  const checkExistsOfChapter = await findChapterBySchoolSubjectId(
    Chapters,
    idSchoolSubject
  );
  if (checkExistsOfChapter === false) {
    const deleteSchoolSubject = await SchoolSubjects.destroy({
      where: { id: idSchoolSubject, name: nameOfSchoolSubjects },
    });
    if (deleteSchoolSubject !== null) {
      return true;
    }
    return res.status(400).json({
      Error: "Przedmiot szkolny posiada przypisane do siebie rozdziały!",
    });
  }
  return false;
}

module.exports = removeSchoolSubjectFromDatabase;
