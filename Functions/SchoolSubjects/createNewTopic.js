async function createNewChapter(Chapters, chapterId, topicName) {
  const createNewChapter = await Chapters.create({
    name: topicName,
    ChapterId: chapterId,
  });
  if (createNewChapter !== null) {
    return true;
  }
  return false;
}

module.exports = createNewChapter;
