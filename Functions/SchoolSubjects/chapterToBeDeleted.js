async function chapterToBeDeleted(Chapters, chapterId) {
  const deleteChapter = await Chapters.destroy({ where: { id: chapterId } });
  if (deleteChapter !== null) {
    return true;
  }
  return false;
}

module.exports = chapterToBeDeleted;
