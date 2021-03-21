async function chapterToBeDeleted(Chapters, chapterId) {
  const deleteChapter = await Chapters.update(
    { toRemove: true },
    { where: { id: chapterId } }
  );
  if (deleteChapter.includes(1)) {
    return true;
  }
  return false;
}

module.exports = chapterToBeDeleted;
