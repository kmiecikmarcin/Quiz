async function takeDataAboutChaptersAndTopics(Model) {
  const takeAll = await Model.findAll({
    attributes: ["name"],
    where: { toRemove: false },
  });
  if (takeAll.length !== 0) {
    return takeAll;
  }
  return false;
}

module.exports = takeDataAboutChaptersAndTopics;
