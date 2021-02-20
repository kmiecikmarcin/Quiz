function checkEnteredGender(gender) {
  if (gender === "Kobieta") {
    return gender;
  }
  if (gender === "Mężczyzna") {
    return gender;
  }
  if (gender === "Inna") {
    return gender;
  }
  return false;
}

module.exports = checkEnteredGender;
