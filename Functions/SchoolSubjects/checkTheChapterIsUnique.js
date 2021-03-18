async function checkTheChapterIsUnique(Chapters, chapter) {
  const checkChapter = await Chapters.findOne({ where: { name: chapter } });
  if (checkChapter !== null) {
    return false;
  }
  return true;
}

module.exports = checkTheChapterIsUnique;
