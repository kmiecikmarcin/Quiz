async function findTopicByChapterId(Topics, chapterId) {
  const checkExistOfTopic = await Topics.findOne({
    where: { ChapterId: chapterId },
  });
  if (checkExistOfTopic !== null) {
    return true;
  }
  return false;
}

module.exports = findTopicByChapterId;
