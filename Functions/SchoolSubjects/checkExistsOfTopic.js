async function checkExistsOfTopic(Topics, topicName) {
  const findTopic = await Topics.findOne({
    where: { name: topicName },
  });
  if (findTopic !== null) {
    return findTopic.id;
  }
  return false;
}

module.exports = checkExistsOfTopic;
