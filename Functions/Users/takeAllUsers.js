const { Op } = require("sequelize");

async function takeAllUsers(Users, takeAdminRoleId) {
  const takeListOfUsers = await Users.findAll({
    where: { TypesOfUsersRoleId: { [Op.ne]: takeAdminRoleId } },
    attributes: { exclude: ["password"] },
  });
  if (takeListOfUsers !== null && Object.keys(takeListOfUsers) !== 0) {
    return takeListOfUsers;
  }
  return false;
}

module.exports = takeAllUsers;
