const bcrypt = require("bcrypt");
const Model = require("../Functions/Others/takeModels");
const checkThatEmailIsUnique = require("../Functions/Users/checkThatEmailIsUnique");
const findGenderID = require("../Functions/Users/findGenderID");
const findBasicEntitlementID = require("../Functions/Users/findBasicEntitlementID");
const checkThatAccountWithEnteredEmailExists = require("../Functions/Users/checkThatAccountWithEnteredEmailExists");
const findNameOfUserEntitlement = require("../Functions/Users/findNameOfUserEntitlement");
const userData = require("../Functions/Users/userData");
const generateToken = require("../Functions/Users/generateToken");
const Response = require("../Class/Response");

const registration = async (req, res) => {
  const { userEmail, userPassword, userGender } = req.body;

  let checkUniqueEmail;

  try {
    checkUniqueEmail = await checkThatEmailIsUnique(Model.Users, userEmail);
  } catch (err) {
    return res
      .status(500)
      .send(Response.returnError("Rejestracja nie powiodła się!"))
      .end();
  }

  let genderID;
  try {
    genderID = await findGenderID(Model.Genders, userGender);
  } catch (err) {
    return res
      .status(500)
      .send(Response.returnError("Rejestracja nie powiodła się!"))
      .end();
  }

  let entitlementID;
  try {
    entitlementID = await findBasicEntitlementID(Model.TypesOfUsersRoles);
  } catch (err) {
    return res
      .status(500)
      .send(Response.returnError("Rejestracja nie powiodła się!"))
      .end();
  }

  if (checkUniqueEmail === true) {
    if (genderID !== null) {
      if (entitlementID !== false) {
        try {
          const hash = await bcrypt.hash(userPassword, 8);

          await Model.Users.create({
            email: userEmail,
            password: hash,
            accountToBeDeleted: false,
            TypesOfUsersRoleId: entitlementID,
            GenderId: genderID,
          });
        } catch (err) {
          return res
            .status(500)
            .send(Response.returnError("Rejestracja nie powiodła się!"))
            .end();
        }
      } else {
        return res
          .status(500)
          .send(Response.returnError("Nie odnaleziono roli dla użytkownika!"))
          .end();
      }
    } else {
      return res
        .status(400)
        .send(Response.returnError("Wprowadzona płeć jest niepoprawna!"))
        .end();
    }
  } else {
    return res
      .status(400)
      .send(Response.returnError("Email jest już przypisany do innego konta!"))
      .end();
  }

  return res
    .status(200)
    .json(Response.returnMessage("Rejestracja przebiegła pomyślnie!"));
};

const login = async (req, res) => {
  const { userEmail, userPassword } = req.body;
  let token;

  try {
    const checkUserEmail = await checkThatAccountWithEnteredEmailExists(
      Model.Users,
      userEmail
    );
    if (checkUserEmail !== false) {
      const nameOfEntitlement = await findNameOfUserEntitlement(
        Model.TypesOfUsersRoles,
        checkUserEmail.userRoleId
      );
      if (nameOfEntitlement !== false) {
        const takenUserData = await userData(
          Model.Users,
          checkUserEmail.userId
        );
        if (takenUserData !== false) {
          token = await generateToken(
            userPassword,
            takenUserData.id,
            takenUserData.password,
            takenUserData.email,
            nameOfEntitlement
          );
          if (token === false) {
            return res
              .status(400)
              .send(Response.returnError("Hasło jest nieprawidłowe!"));
          }
        } else {
          return res
            .status(400)
            .send(
              Response.returnError("Nie udało się pobrać danych użytkownika!")
            );
        }
      } else {
        return res
          .status(400)
          .send(
            Response.returnError(
              "Konto użytkownika posiada nieprawidłowe uprawnienia!"
            )
          );
      }
    } else {
      return res
        .status(400)
        .send(Response.returnError("Wprowadzony email nie istnieje!"));
    }
  } catch (err) {
    return res.status(500).send(Response.returnError("Błąd logowania!")).end();
  }

  return res.status(200).json(Response.returnToken(token));
};

const email = async (req, res, dataFromAuth) => {
  let newToken;

  const { newUserEmail, userPassword } = req.body;

  try {
    const checkUserAccount = await checkThatAccountWithEnteredEmailExists(
      Model.Users,
      dataFromAuth.email
    );
    if (checkUserAccount !== false) {
      const takeUserData = await userData(Model.Users, dataFromAuth.id);
      if (takeUserData !== false) {
        const match = await bcrypt.compare(userPassword, takeUserData.password);
        if (match) {
          const updateResult = await Model.Users.update(
            { email: newUserEmail },
            { where: { id: dataFromAuth.id, email: dataFromAuth.email } }
          );
          if (updateResult.includes(1)) {
            newToken = await generateToken(
              userPassword,
              takeUserData.id,
              takeUserData.password,
              newUserEmail,
              dataFromAuth.name
            );
          }
        } else {
          return res
            .status(400)
            .send(
              Response.returnError("Wprowadzone hasło jest nieprawidłowe!")
            );
        }
      } else {
        return res
          .status(500)
          .send(
            Response.returnError("Nie udało się pobrać danych użytkownika!")
          );
      }
    } else {
      return res.status(500).send(Response.returnError("Konto nie istnieje!"));
    }
  } catch (err) {
    return res
      .status(500)
      .send(Response.returnError("Nie udało się zmienić adresu e-mail!"))
      .end();
  }

  return res.status(200).json(Response.returnToken(newToken));
};

const password = async (req, res, dataFromAuth) => {
  let newToken;

  const { newUserPassword, userPassword } = req.body;

  try {
    const checkUserAccount = await checkThatAccountWithEnteredEmailExists(
      Model.Users,
      dataFromAuth.email
    );
    if (checkUserAccount !== false) {
      const takeUserData = await userData(Model.Users, dataFromAuth.id);
      if (takeUserData !== false) {
        const match = await bcrypt.compare(userPassword, takeUserData.password);
        if (match) {
          const hash = await bcrypt.hash(newUserPassword, 8);
          const updateResult = await Model.Users.update(
            { password: hash },
            { where: { id: dataFromAuth.id, email: dataFromAuth.email } }
          );
          if (updateResult.includes(1)) {
            newToken = await generateToken(
              userPassword,
              takeUserData.id,
              takeUserData.password,
              takeUserData.email,
              dataFromAuth.name
            );
          }
        } else {
          return res
            .status(400)
            .send(
              Response.returnError("Wprowadzone hasło jest nieprawidłowe!")
            );
        }
      } else {
        return res
          .status(500)
          .send(
            Response.returnError("Nie udało się pobrać danych użytkownika!")
          );
      }
    } else {
      return res.status(500).send(Response.returnError("Konto nie istnieje!"));
    }
  } catch (err) {
    return res
      .status(500)
      .send(Response.returnError("Nie udało się zmienić hasła!"))
      .end();
  }

  return res.status(200).json(Response.returnToken(newToken));
};

const accountToDelete = async (req, res, dataFromAuth) => {
  const userPassword = req.body.userPassword;

  try {
    const checkUserAccount = await checkThatAccountWithEnteredEmailExists(
      Model.Users,
      dataFromAuth.email
    );
    if (checkUserAccount !== false) {
      const takeUserData = await userData(Model.Users, dataFromAuth.id);
      if (takeUserData !== false) {
        const match = await bcrypt.compare(userPassword, takeUserData.password);
        if (match) {
          const accountToDelete = await Model.Users.update(
            { accountToBeDeleted: true },
            { where: { id: takeUserData.id, password: takeUserData.password } }
          );
          if (!accountToDelete.includes(1)) {
            return res
              .status(400)
              .send(Response.returnError("Nie udało się dezaktywować konta!"));
          }
        } else {
          return res
            .status(400)
            .send(
              Response.returnError("Wprowadzone hasło jest nieprawidłowe!")
            );
        }
      } else {
        return res
          .status(500)
          .send(
            Response.returnError("Nie udało się pobrać danych użytkownika!")
          );
      }
    } else {
      return res.status(500).send(Response.returnError("Konto nie istnieje!"));
    }
  } catch (err) {
    return res
      .status(500)
      .send(Response.returnError("Usunięcie konta nie powiodło się!"))
      .end();
  }

  return res
    .status(200)
    .json(Response.returnMessage("Konto zostało dezaktywowane!"));
};

exports.registration = registration;
exports.login = login;
exports.email = email;
exports.password = password;
exports.accountToDelete = accountToDelete;
