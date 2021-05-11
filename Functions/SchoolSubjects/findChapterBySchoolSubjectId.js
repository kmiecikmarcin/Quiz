async function findChapterBySchoolSubjectId(Chapters, idSchoolSubject) {
  const checkExistOfChapter = await Chapters.findOne({
    where: { SchoolSubjectId: idSchoolSubject },
  });
  if (checkExistOfChapter !== null) {
    return true;
  }
  return false;
}

module.exports = findChapterBySchoolSubjectId;
