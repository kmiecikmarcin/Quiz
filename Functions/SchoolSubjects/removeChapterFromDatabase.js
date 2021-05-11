const findTopicByChapterId = require("./findTopicByChapterId");

async function removeChapterFromDatabase(
  res,
  Chapters,
  Topics,
  nameOfChapter,
  chapterId
) {
  const checkExistsOfTopic = await findTopicByChapterId(Topics, chapterId);
  if (checkExistsOfTopic === false) {
    const deleteChapter = await Chapters.destroy({
      where: { id: chapterId, name: nameOfChapter, toRemove: true },
    });
    if (deleteChapter !== null) {
      return true;
    }
    return res.status(400).json({
      Error: "Rozdział posiada przypisane do siebie tematy!",
    });
  }
  return false;
}

module.exports = removeChapterFromDatabase;
