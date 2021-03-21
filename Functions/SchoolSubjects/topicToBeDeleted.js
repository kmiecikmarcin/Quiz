async function topicToBeDeleted(Topics, topicId) {
  const deleteTopic = await Topics.update(
    { toRemove: true },
    { where: { id: topicId } }
  );
  if (deleteTopic.includes(1)) {
    return true;
  }
  return false;
}

module.exports = topicToBeDeleted;
