async function checkThatChapterIsAssignToTopic(Topics, chapterId) {
  const findChapterAssignedToTopics = await Topics.findAll({
    where: { ChapterId: chapterId },
  });
  if (findChapterAssignedToTopics.length !== 0) {
    return true;
  }
  return false;
}

module.exports = checkThatChapterIsAssignToTopic;
