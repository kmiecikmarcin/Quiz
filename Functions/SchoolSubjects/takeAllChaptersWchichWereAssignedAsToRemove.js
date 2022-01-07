async function takeAllChaptersWhichAreToRemove(Chapters) {
  const takeListOfChapters = await Chapters.findAll({
    where: { toRemove: true },
  });
  if (takeListOfChapters !== null && Object.keys(takeListOfChapters) !== 0) {
    return takeListOfChapters;
  }
  return false;
}

module.exports = takeAllChaptersWhichAreToRemove;
