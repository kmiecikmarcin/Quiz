async function checkTheChapterIsUnique(Topics, topic) {
  const checkTopic = await Topics.findOne({ where: { name: topic } });
  if (checkTopic !== null) {
    return false;
  }
  return true;
}

module.exports = checkTheChapterIsUnique;
