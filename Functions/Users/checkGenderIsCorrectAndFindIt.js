async function checkGenderIsCorrectAndFindIt(Genders, userGender) {
  const findGender = await Genders.findOne({
    where: { name: userGender },
  });
  if (findGender !== null) {
    return findGender.id;
  }
  return false;
}

module.exports = checkGenderIsCorrectAndFindIt;
