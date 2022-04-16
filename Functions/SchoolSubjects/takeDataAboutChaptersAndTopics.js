async function takeDataAboutChaptersandTopics(Model) {
  const takeAllData = await Model.findAll({
    attributes: ["name"],
    where: { toRemove: false }
  });
  if (takeAll.length !== 0) {
    return takeAllData;
  }
  return false;
}

module.exports = takeDataAboutChaptersandTopics;
