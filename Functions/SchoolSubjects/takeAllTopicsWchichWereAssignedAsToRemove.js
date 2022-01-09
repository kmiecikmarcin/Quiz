async function takeAllTopicsWchichWereAssignedAsToRemove(Topics) {
  const takeListOfTopics = await Topics.findAll({
    where: { toRemove: true },
  });
  if (takeListOfTopics !== null && Object.keys(takeListOfTopics) !== 0) {
    return takeListOfTopics;
  }
  return false;
}

module.exports = takeAllTopicsWchichWereAssignedAsToRemove;
