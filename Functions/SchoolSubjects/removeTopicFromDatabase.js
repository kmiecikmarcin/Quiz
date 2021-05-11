async function removeTopicFromDatabase(Topics, topicId, nameOfTopic) {
  const deleteTopic = await Topics.destroy({
    where: { id: topicId, name: nameOfTopic, toRemove: true },
  });
  if (deleteTopic !== null) {
    return true;
  }
  return false;
}

module.exports = removeTopicFromDatabase;
