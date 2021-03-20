async function checkChapterAssignedToTopics(Topics, chapterId) {
  const findChapterAssignedToTopics = await Topics.findAll({
    where: { ChapterId: chapterId },
  });
  if (findChapterAssignedToTopics !== null) {
    return true;
  }
  return false;
}

module.exports = checkChapterAssignedToTopics;
