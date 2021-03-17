async function takeAllChapters(Topics) {
  const takeTopics = await Topics.findAll({
    raw: true,
    attributes: ["id", "name", "ChapterId"],
  });
  if (takeTopics !== null) {
    return takeTopics;
  }
  return false;
}

module.exports = takeAllChapters;
