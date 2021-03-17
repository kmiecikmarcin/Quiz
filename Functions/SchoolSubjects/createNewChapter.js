async function createNewChapter(Chapters, subjectId, chapterName) {
  const createNewChapter = await Chapters.create({
    name: chapterName,
    SchoolSubjectId: subjectId,
  });
  if (createNewChapter !== null) {
    return true;
  }
  return false;
}

module.exports = createNewChapter;
