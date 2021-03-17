async function takeAllChapters(Chapters) {
  const takeChapters = await Chapters.findAll({
    raw: true,
    attributes: ["id", "name", "SchoolSubjectId"],
  });
  if (takeChapters !== null) {
    return takeChapters;
  }
  return false;
}

module.exports = takeAllChapters;
