const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Model = require("../Functions/Others/takeModels");
const checkThatEmailIsUnique = require("../Functions/Users/checkThatEmailIsUnique");
const findGenderID = require("../Functions/Users/findGenderID");
const findBasicEntitlementID = require("../Functions/Users/findBasicEntitlementID");
const checkThatAccountWithEnteredEmailExists = require("../Functions/Users/checkThatAccountWithEnteredEmailExists");
const findNameOfUserEntitlement = require("../Functions/Users/findNameOfUserEntitlement");
const userData = require("../Functions/Users/userData");
const generateToken = require("../Functions/Users/generateToken");

const registration = async (req, res) => {
  const response = {
    messages: {
      message: [],
      error: [],
    },
  };
  const { userEmail, userPassword, userGender } = req.body;

  let checkUniqueEmail;

  try {
    checkUniqueEmail = await checkThatEmailIsUnique(Model.Users, userEmail);
  } catch (err) {
    response.messages.error.push("Rejestracja nie powiodła się!");
    return res.status(500).send(response).end();
  }

  let genderID;
  try {
    genderID = await findGenderID(Model.Genders, userGender);
  } catch (err) {
    response.messages.error.push("Rejestracja nie powiodła się!");
    return res.status(500).send(response).end();
  }

  let entitlementID;
  try {
    entitlementID = await findBasicEntitlementID(Model.TypesOfUsersRoles);
  } catch (err) {
    response.messages.error.push("Rejestracja nie powiodła się!");
    return res.status(500).send(response).end();
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
          response.messages.error.push("Rejestracja nie powiodła się!");
          return res.status(500).send(response).end();
        }
      } else {
        response.messages.error.push("Nie odnaleziono roli dla użytkownika!");
        return res.status(500).send(response).end();
      }
    } else {
      response.messages.error.push("Wprowadzona płeć jest niepoprawna!");
      return res.status(400).send(response).end();
    }
  } else {
    response.messages.error.push("Email jest już przypisany do innego konta!");
    return res.status(400).send(response).end();
  }

  response.messages.message.push("Rejestracja przebiegła pomyślnie!");
  return res.status(201).json(response);
};

const login = async (req, res) => {
  const response = {
    messages: {
      token: [],
      error: [],
    },
  };
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
            response.messages.error.push("Hasło jest nieprawidłowe!");
            return res.status(400).send(response);
          }
        } else {
          response.messages.error.push(
            "Nie udało się pobrać danych użytkownika!"
          );
          return res.status(400).send(response);
        }
      } else {
        response.messages.error.push(
          "Konto użytkownika posiada nieprawidłowe uprawnienia!"
        );
        return res.status(400).send(response);
      }
    } else {
      response.messages.error.push("Wprowadzony email nie istnieje!");
      return res.status(400).send(response);
    }
  } catch (err) {
    response.messages.error.push("Błąd logowania!");
    return res.status(500).send(response).end();
  }

  response.messages.token.push(token);
  return res.status(200).json(response);
};

const email = async (req, res) => {
  const response = {
    messages: {
      token: [],
      error: [],
    },
  };

  let newToken;
  let dataFromAuth;

  const { newUserEmail, userPassword } = req.body;

  try {
    jwt.verify(
      req.token,
      process.env.S3_SECRETKEY,
      async (jwtError, authData) => {
        if (jwtError) {
          response.messages.error.push("Błąd uwierzytelniania!");
          res.status(403).json(response);
        } else {
          dataFromAuth = authData;
        }
      }
    );
  } catch (err) {
    response.messages.error.push(
      "Nie udało się przeprowadzić procesu uwierzytelniania!"
    );
    return res.status(500).send(response);
  }

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
          response.messages.error.push("Wprowadzone hasło jest nieprawidłowe!");
          return res.status(400).send(response);
        }
      } else {
        response.messages.error.push(
          "Nie udało się pobrać danych użytkownika!"
        );
        return res.status(500).send(response);
      }
    } else {
      response.messages.error.push("Konto nie istnieje!");
      return res.status(500).send(response);
    }
  } catch (err) {
    response.messages.error.push("Nie udało się zmienić adresu e-mail!");
    return res.status(500).send(response).end();
  }

  response.messages.token.push(newToken);
  return res.status(200).json(response);
};

const password = async (req, res) => {
  const response = {
    messages: {
      token: [],
      error: [],
    },
  };

  let newToken;
  let dataFromAuth;

  const { newUserPassword, userPassword } = req.body;

  try {
    jwt.verify(
      req.token,
      process.env.S3_SECRETKEY,
      async (jwtError, authData) => {
        if (jwtError) {
          response.messages.error.push("Błąd uwierzytelniania!");
          res.status(403).json(response);
        } else {
          dataFromAuth = authData;
        }
      }
    );
  } catch (err) {
    response.messages.error.push(
      "Nie udało się przeprowadzić procesu uwierzytelniania!"
    );
    return res.status(500).send(response);
  }

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
          response.messages.error.push("Wprowadzone hasło jest nieprawidłowe!");
          return res.status(400).send(response);
        }
      } else {
        response.messages.error.push(
          "Nie udało się pobrać danych użytkownika!"
        );

        return res.status(500).send(response);
      }
    } else {
      response.messages.error.push("Konto nie istnieje!");
      return res.status(500).send(response);
    }
  } catch (err) {
    response.messages.error.push("Nie udało się zmienić hasła!");
    return res.status(500).send(response).end();
  }

  response.messages.token.push(newToken);
  return res.status(200).json(response);
};

const accountToDelete = async (req, res) => {
  const response = {
    messages: {
      message: [],
      error: [],
    },
  };

  let dataFromAuth;

  const { userPassword } = req.body;

  try {
    jwt.verify(
      req.token,
      process.env.S3_SECRETKEY,
      async (jwtError, authData) => {
        if (jwtError) {
          response.messages.error.push("Błąd uwierzytelniania!");
          res.status(403).json(response);
        } else {
          dataFromAuth = authData;
        }
      }
    );
  } catch (err) {
    response.messages.error.push(
      "Nie udało się przeprowadzić procesu uwierzytelniania!"
    );
    return res.status(500).send(response);
  }

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
          await Model.Users.update(
            { accountToBeDeleted: true },
            { where: { id: takeUserData.id, password: userPassword } }
          );
        } else {
          response.messages.error.push("Wprowadzone hasło jest nieprawidłowe!");
          return res.status(400).send(response);
        }
      } else {
        response.messages.error.push(
          "Nie udało się pobrać danych użytkownika!"
        );

        return res.status(500).send(response);
      }
    } else {
      response.messages.error.push("Konto nie istnieje!");
      return res.status(500).send(response);
    }
  } catch (err) {
    response.messages.error.push("Usunięcie konta nie powiodło się!");
    return res.status(500).send(response).end();
  }

  response.messages.message.push("Konto zostało dezaktywowane!");
  return res.status(200).json(response);
};

exports.registration = registration;
exports.login = login;
exports.email = email;
exports.password = password;
exports.accountToDelete = accountToDelete;
