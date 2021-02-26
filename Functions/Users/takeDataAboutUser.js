const responseData = {
  id: null,
  email: null,
  password: null,
};

async function takeDataAboutUser(Users, userId) {
  const takeUserData = await findOne({ where: { id: userId } });
  if (takeUserData !== null) {
    responseData.id = takeUserData.id;
    responseData.email = takeUserData.email;
    responseData.password = takeUserData.password;
    return responseData;
  }
  return false;
}

module.exports = takeDataAboutUser;
