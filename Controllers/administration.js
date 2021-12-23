const jwt = require("jsonwebtoken");
const Model = require("../Functions/Others/takeModels");
const checkTheSchoolSubjectExists = require("../Functions/SchoolSubjects/checkTheSchoolSubjectExists");
const createNewSchoolSubject = require("../Functions/SchoolSubjects/createNewSchoolSubject");
const removeSchoolSubjectFromDatabase = require("../Functions/SchoolSubjects/removeSchoolSubjectFromDatabase");
const checkTheChapterExists = require("../Functions/SchoolSubjects/checkExistsOfChapter");
const removeChapterFromDatabase = require("../Functions/SchoolSubjects/removeChapterFromDatabase");
const removeTopicFromDatabase = require("../Functions/SchoolSubjects/removeTopicFromDatabase");
const checkTheTopicExists = require("../Functions/SchoolSubjects/checkExistsOfTopic");
const takeListOfUsersWhichAreToRemove = require("../Functions/Users/takeListOfUsersWhichAreToRemove");
const deleteUserById = require("../Functions/Users/deleteUserById");
const findUserById = require("../Functions/Users/findUserById");
const takeListOfUsers = require("../Functions/Users/takeAllUsers");
const findAdminRoleId = require("../Functions/Users/findAdminRoleId");
const findIdOfTeacherPermission = require("../Functions/Users/findIdOfTeacherPermission");
const updateUserPermissionToTeacherPermissions = require("../Functions/Users/updateUserPermissionToTeacherPermissions");

const createSchoolSubject = async (req, res) => {
  const response = {
    messages: {
      message: [],
      error: []
    },
  };

  const { nameOfSubject } = req.body;

  let dataFromAuth;

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
    if (dataFromAuth.name === process.env.S3_ADMIN_PERMISSIONS) {
      const checkSchoolSubjectExist =
                  await checkTheSchoolSubjectExists(
                    Model.SchoolSubjects,
                    nameOfSubject
                  );
      if (checkSchoolSubjectExist === false) {
        const newSchoolSubject = await createNewSchoolSubject(
          Model.SchoolSubjects,
          nameOfSubject
        );
        if (newSchoolSubject === false) {
          response.messages.error.push("Nie udało się utworzyć nowego przedmiotu szkolnego!");
          return res.status(400).json(response);
        }
      } else {
        response.messages.error.push("Przedmiot szkolny już istnieje!");
        return res.status(400).json(response);
      }
    } else {
      response.messages.error.push(
        "Nie posiadasz uprawnień, by móc dodać nowy rodział!"
      );
      return res.status(400).json(response);
    }
  } catch {
    response.messages.error.push(
      "Nie można przeprowadzić procesu dodawania nowego przedmiotu szkolnego!"
    );
    return res.status(500).json(response);
  }

  response.messages.message.push("Pomyślnie dodano nowy przedmiot szkolny!");
  return res.status(200).json(response);
};

const removeSchoolSubject = async (req, res) => {
  const response = {
    messages: {
      message: [],
      error: []
    },
  };

  const { nameOfSubject } = req.body;

  let dataFromAuth;

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
    if (dataFromAuth.name === process.env.S3_ADMIN_PERMISSIONS) {
      const checkSchoolSubjectExist =
      await checkTheSchoolSubjectExists(
        Model.SchoolSubjects,
        nameOfSubject
      );
      if (checkSchoolSubjectExist !== false) {
        const deleteSchoolSubject =
        await removeSchoolSubjectFromDatabase(
          res,
          Model.SchoolSubjects,
          Model.Chapters,
          req.body.name_of_school_subject,
          checkSchoolSubjectExist
        );
        if (deleteSchoolSubject === false) {
          response.messages.error.push("Nie udało się usunąć przedmiotu szkolnego!");
          return res.status(400).json(response);
        }
      } else {
        response.messages.error.push("Przedmiot szkolny nie istnieje!");
        return res.status(400).json(response);
      }
    } else {
      response.messages.error.push(
        "Nie posiadasz uprawnień, by móc dodać nowy rodział!"
      );
      return res.status(400).json(response);
    }
  } catch {
    response.messages.message.push(
      "Nie można przeprowadzić procesu usuwania przedmiotu szkolnego!"
    );
    return res.status(500).json(response);
  }

  response.messages.message.push("Pomyślnie usunięto przedmiot szkolny!");
  return res.status(200).json(response);
};

const removeChapter = async (req, res) => {
  const response = {
    messages: {
      message: [],
      error: []
    },
  };

  const { nameOfChapter } = req.body;

  let dataFromAuth;

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
    if (dataFromAuth.name === process.env.S3_ADMIN_PERMISSIONS) {
      const checkChapter = await checkTheChapterExists(
        Model.Chapters,
        nameOfChapter
      );
      if (checkChapter !== false) {
        const deleteChapter = await removeChapterFromDatabase(
          res,
          Model.Chapters,
          Model.Topics,
          req.body.name_of_chapter,
          checkChapter
        );
        if (deleteChapter === false) {
          response.messages = {
            error: "Nie udało się usunąć rozdziału!",
          };
          res.status(400).json(response);
        }
      } else {
        response.messages.error.push(
          "Rozdział nie istnieje!"
        );
        return res.status(400).json(response);
      }
    } else {
      response.messages.error.push(
        "Nie posiadasz uprawnień, by móc dodać nowy rodział!"
      );
      return res.status(400).json(response);
    }
  } catch {
    response.messages.message.push(
      "Nie można przeprowadzić procesu usuwania rozdziału!"
    );
    return res.status(500).json(response);
  }

  response.messages.message.push("Pomyślnie usunięto rozdział!");
  return res.status(200).json(response);
};

const removeTopic = async (req, res) => {
  const response = {
    messages: {
      message: [],
      error: []
    },
  };

  const { nameOfTopic } = req.body;

  let dataFromAuth;

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
    if (dataFromAuth.name === process.env.S3_ADMIN_PERMISSIONS) {
      const checkTopic = await checkTheTopicExists(
        Model.Topics,
        nameOfTopic
      );
      if (checkTopic !== false) {
        const deleteTopic = await removeTopicFromDatabase(
          Model.Topics,
          checkTopic,
          req.body.name_of_topic
        );
        if (deleteTopic === false) {
          response.messages.error.push(
            "Nie udało się usunąć tematu!"
          );
          return res.status(400).json(response);
        }
      } else {
        response.messages.error.push(
          "Temat nie istnieje!"
        );
        return res.status(400).json(response);
      }
    } else {
      response.messages.error.push(
        "Nie posiadasz uprawnień, by móc dodać nowy rodział!"
      );
      return res.status(400).json(response);
    }
  } catch {
    response.messages.message.push(
      "Nie można przeprowadzić procesu usuwania tematu!"
    );
    return res.status(500).json(response);
  }

  response.messages.message.push("Pomyślnie usunięto temat!");
  return res.status(200).json(response);
};

const takeAllUsersToRemove = async (req, res) => {
  const response = {
    messages: {
      message: [],
      error: [],
      users: [],
    },
  };

  let dataFromAuth;

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
    if (dataFromAuth.name === process.env.S3_ADMIN_PERMISSIONS) {
      const takeListOfUsers = await takeListOfUsersWhichAreToRemove(
        Model.Users
      );
      if (takeListOfUsers !== false) {
        listOfUsersToRemove = takeListOfUsers;
      } else {
        response.messages.message.push(
          "Nie udało się pobrać listy użytkowników!"
        );
        return res.status(400).json(response);
      }
    } else {
      response.messages.message.push(
        "Nie posiadasz uprawnień!"
      );
      return res.status(400).json(response);
    }
  } catch {
    response.messages.message.push(
      "Nie można pobrać listy użytkowników!"
    );
    return res.status(500).json(response);
  }

  response.messages.users.push(listOfUsersToRemove);
  return res.status(200).json(response);
};

const daleteUserAccount = async (req, res) => {
  const response = {
    messages: {
      message: [],
      error: []
    },
  };

  const { userId } = req.body;

  let dataFromAuth;

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
    if (dataFromAuth.name === process.env.S3_ADMIN_PERMISSIONS) {
      const findUser = await findUserById(
        Model.Users,
        userId
      );
      if (findUser !== false) {
        const deleteUser = await deleteUserById(
          Model.Users,
          userId
        );
        if (deleteUser === false) {
          response.messages.error.push(
            "Nie udało się usunąć użytkownika!"
          );
          return res.status(400).send(response);
        }
      } else {
        response.messages.error.push(
          "Wybrane konto użytkownika nie istnieje!"
        );
        return res.status(400).send(response);
      }
    } else {
      response.messages.error.push(
        "Nie posiadasz uprawnień, aby móc usunąć użytkownika!"
      );
      return res.status(400).send(response);
    }
  } catch {
    response.messages.error.push(
      "Nie udało się przeprowadzić procesu usuwania konta użytkownika!"
    );
    return res.status(500).send(response);
  }

  response.messages.message.push("Pomyślnie usunięto konto użytkownika!");
  return res.status(200).json(response);
};

const takeAllUsers = async (req, res) => {
  const response = {
    messages: {
      message: [],
      error: [],
      users: [],
    },
  };

  let dataFromAuth;

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
    if (dataFromAuth.name === process.env.S3_ADMIN_PERMISSIONS) {
      const takeAdminRoleId = await findAdminRoleId(
        Model.TypesOfUsersRoles
      );
      if (takeAdminRoleId !== false) {
        const takeUsers = await takeListOfUsers(
          Model.Users,
          takeAdminRoleId
        );
        if (takeUsers !== false) {
          listOfUsers = takeUsers;
        } else {
          response.messages.message.push(
            "Nie udało się pobrać listy użytkowników!"
          );
          return res.status(400).json(response);
        }
      } else {
        response.messages.message.push(
          "Nie odnaleziono roli użytkownika!"
        );
        return res.status(400).json(response);
      }
    } else {
      response.messages.message.push(
        "Nie posiadasz uprawnień!"
      );
      return res.status(400).json(response);
    }
  } catch {
    response.messages.message.push(
      "Nie można pobrać listy użytkowników!"
    );
    return res.status(500).json(response);
  }

  response.messages.users.push(listOfUsers);
  return res.status(200).json(response);
};

const assignTeacherPermissions = async (req, res) => {
  const response = {
    messages: {
      message: [],
      error: [],
    },
  };

  let dataFromAuth;

  const { userId } = req.body;

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
    if (dataFromAuth.name === process.env.S3_ADMIN_PERMISSIONS) {
      const findUser = await findUserById(
        Model.Users,
        userId
      );
      if (findUser !== false) {
        const findIdOfTeacher = await findIdOfTeacherPermission(
          Model.TypesOfUsersRoles
        );
        if (findIdOfTeacher !== false) {
          const updatePermission = await updateUserPermissionToTeacherPermissions(
            Model.Users,
            findIdOfTeacher,
            userId
          );
          if (updatePermission === false) {
            response.messages.message.push(
              "Nie udało się zmienić uprawnień wybranemu użytkownikowi!"
            );
            return res.status(400).json(response);
          }
        } else {
          response.messages.message.push(
            "Rola użytkownika - Nauczyciel - nie istnieje!"
          );
          return res.status(400).json(response);
        }
      } else {
        response.messages.message.push(
          "Użytkownik nie istnieje!"
        );
        return res.status(400).json(response);
      }
    } else {
      response.messages.message.push(
        "Nie posiadasz uprawnień!"
      );
      return res.status(400).json(response);
    }
  } catch {
    response.messages.message.push(
      "Nie można nadać uprawnień nauczyciela wybranemu użytkownikowi!"
    );
    return res.status(500).json(response);
  }

  response.messages.message.push("Pomyślnie zmieniono uprawnienia dla użytkownika!");
  return res.status(200).json(response);
};

exports.createSchoolSubject = createSchoolSubject;
exports.removeSchoolSubject = removeSchoolSubject;
exports.removeChapter = removeChapter;
exports.removeTopic = removeTopic;
exports.takeAllUsersToRemove = takeAllUsersToRemove;
exports.daleteUserAccount = daleteUserAccount;
exports.takeAllUsers = takeAllUsers;
exports.assignTeacherPermissions = assignTeacherPermissions;
