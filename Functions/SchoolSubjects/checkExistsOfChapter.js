async function checkExistsOfChapter(Chapters, enteredChapter) {
  const findChapter = await Chapters.findOne({
    where: { name: enteredChapter },
  });
  if (findChapter !== null) {
    return findChapter.id;
  }
  return false;
}

module.exports = checkExistsOfChapter;
