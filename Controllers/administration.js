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
const takeAllChaptersWchichWereAssignedAsToRemove = require("../Functions/SchoolSubjects/takeAllChaptersWchichWereAssignedAsToRemove");
const takeAllTopicsWchichWereAssignedAsToRemove = require("../Functions/SchoolSubjects/takeAllTopicsWchichWereAssignedAsToRemove");

const createSchoolSubject = async (req, res, dataFromAuth) => {
  const response = {
    messages: {
      message: [],
      error: [],
    },
  };

  const nameOfSubject = req.body.nameOfSchoolSubject;

  try {
    if (dataFromAuth.name === process.env.S3_ADMIN_PERMISSIONS) {
      const checkSchoolSubjectExist = await checkTheSchoolSubjectExists(
        Model.SchoolSubjects,
        nameOfSubject
      );
      if (checkSchoolSubjectExist === false) {
        const newSchoolSubject = await createNewSchoolSubject(
          Model.SchoolSubjects,
          nameOfSubject
        );
        if (newSchoolSubject === false) {
          response.messages.error.push(
            "Nie udało się utworzyć nowego przedmiotu szkolnego!"
          );
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
  } catch (err) {
    console.log(err);
    response.messages.error.push(
      "Nie można przeprowadzić procesu dodawania nowego przedmiotu szkolnego!"
    );
    return res.status(500).json(response);
  }

  response.messages.message.push("Pomyślnie dodano nowy przedmiot szkolny!");
  return res.status(200).json(response);
};

const removeSchoolSubject = async (req, res, dataFromAuth) => {
  const response = {
    messages: {
      message: [],
      error: [],
    },
  };

  const nameOfSubject = req.body.nameOfSchoolSubject;

  try {
    if (dataFromAuth.name === process.env.S3_ADMIN_PERMISSIONS) {
      const checkSchoolSubjectExist = await checkTheSchoolSubjectExists(
        Model.SchoolSubjects,
        nameOfSubject
      );
      if (checkSchoolSubjectExist !== false) {
        const deleteSchoolSubject = await removeSchoolSubjectFromDatabase(
          res,
          Model.SchoolSubjects,
          Model.Chapters,
          nameOfSubject,
          checkSchoolSubjectExist
        );
        if (deleteSchoolSubject === false) {
          response.messages.error.push(
            "Nie udało się usunąć przedmiotu szkolnego!"
          );
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

const removeChapter = async (req, res, dataFromAuth) => {
  const response = {
    messages: {
      message: [],
      error: [],
    },
  };

  const chapter = req.body.nameOfChapter;

  try {
    if (dataFromAuth.name === process.env.S3_ADMIN_PERMISSIONS) {
      const checkChapter = await checkTheChapterExists(Model.Chapters, chapter);
      if (checkChapter !== false) {
        const deleteChapter = await removeChapterFromDatabase(
          res,
          Model.Chapters,
          Model.Topics,
          chapter,
          checkChapter
        );
        if (deleteChapter === false) {
          response.messages = {
            error: "Nie udało się usunąć rozdziału!",
          };
          res.status(400).json(response);
        }
      } else {
        response.messages.error.push("Rozdział nie istnieje!");
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

const removeTopic = async (req, res, dataFromAuth) => {
  const response = {
    messages: {
      message: [],
      error: [],
    },
  };

  const topic = req.body.nameOfTopic;

  try {
    if (dataFromAuth.name === process.env.S3_ADMIN_PERMISSIONS) {
      const checkTopic = await checkTheTopicExists(Model.Topics, topic);
      if (checkTopic !== false) {
        const deleteTopic = await removeTopicFromDatabase(
          Model.Topics,
          checkTopic,
          topic
        );
        if (deleteTopic === false) {
          response.messages.error.push("Nie udało się usunąć tematu!");
          return res.status(400).json(response);
        }
      } else {
        response.messages.error.push("Temat nie istnieje!");
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

const takeAllUsersToRemove = async (res, dataFromAuth) => {
  const response = {
    messages: {
      message: [],
      error: [],
      users: [],
    },
  };

  try {
    if (dataFromAuth.name === process.env.S3_ADMIN_PERMISSIONS) {
      const takeListOfUsers = await takeListOfUsersWhichAreToRemove(
        Model.Users
      );
      if (takeListOfUsers !== false) {
        listOfUsersToRemove = takeListOfUsers;
      } else {
        response.messages.message.push("Lista użytkowników jest pusta!");
        return res.status(404).json(response);
      }
    } else {
      response.messages.message.push("Nie posiadasz uprawnień!");
      return res.status(400).json(response);
    }
  } catch {
    response.messages.message.push("Nie można pobrać listy użytkowników!");
    return res.status(500).json(response);
  }

  response.messages.users.push(listOfUsersToRemove);
  return res.status(200).json(response);
};

const daleteUserAccount = async (req, res, dataFromAuth) => {
  const response = {
    messages: {
      message: [],
      error: [],
    },
  };

  const user = req.body.userId;

  try {
    if (dataFromAuth.name === process.env.S3_ADMIN_PERMISSIONS) {
      const findUser = await findUserById(Model.Users, user);
      if (findUser !== false) {
        const deleteUser = await deleteUserById(Model.Users, user);
        if (deleteUser === false) {
          response.messages.error.push("Nie udało się usunąć użytkownika!");
          return res.status(400).send(response);
        }
      } else {
        response.messages.error.push("Wybrane konto użytkownika nie istnieje!");
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

const takeAllUsers = async (res, dataFromAuth) => {
  const response = {
    messages: {
      message: [],
      error: [],
      users: [],
    },
  };

  try {
    if (dataFromAuth.name === process.env.S3_ADMIN_PERMISSIONS) {
      const takeAdminRoleId = await findAdminRoleId(Model.TypesOfUsersRoles);
      if (takeAdminRoleId !== false) {
        const takeUsers = await takeListOfUsers(Model.Users, takeAdminRoleId);
        if (takeUsers !== false) {
          listOfUsers = takeUsers;
        } else {
          response.messages.message.push("Lista użytkowników jest pusta!");
          return res.status(404).json(response);
        }
      } else {
        response.messages.message.push("Nie odnaleziono roli użytkownika!");
        return res.status(400).json(response);
      }
    } else {
      response.messages.message.push("Nie posiadasz uprawnień!");
      return res.status(400).json(response);
    }
  } catch {
    response.messages.message.push("Nie można pobrać listy użytkowników!");
    return res.status(500).json(response);
  }

  response.messages.users.push(listOfUsers);
  return res.status(200).json(response);
};

const assignTeacherPermissions = async (req, res, dataFromAuth) => {
  const response = {
    messages: {
      message: [],
      error: [],
    },
  };

  try {
    if (dataFromAuth.name === process.env.S3_ADMIN_PERMISSIONS) {
      const findUser = await findUserById(Model.Users, user);
      if (findUser !== false) {
        const findIdOfTeacher = await findIdOfTeacherPermission(
          Model.TypesOfUsersRoles
        );
        if (findIdOfTeacher !== false) {
          const updatePermission =
            await updateUserPermissionToTeacherPermissions(
              Model.Users,
              findIdOfTeacher,
              user
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
        response.messages.message.push("Użytkownik nie istnieje!");
        return res.status(400).json(response);
      }
    } else {
      response.messages.message.push("Nie posiadasz uprawnień!");
      return res.status(400).json(response);
    }
  } catch {
    response.messages.message.push(
      "Nie można nadać uprawnień nauczyciela wybranemu użytkownikowi!"
    );
    return res.status(500).json(response);
  }

  response.messages.message.push(
    "Pomyślnie zmieniono uprawnienia dla użytkownika!"
  );
  return res.status(200).json(response);
};

const takeAllChaptersWhichAreToRemove = async (res, dataFromAuth) => {
  const response = {
    messages: {
      message: [],
      error: [],
      chapters: [],
    },
  };

  try {
    if (dataFromAuth.name === process.env.S3_ADMIN_PERMISSIONS) {
      const takeChapters = await takeAllChaptersWchichWereAssignedAsToRemove(
        Model.Chapters
      );
      if (takeChapters !== false) {
        listOfChapters = takeChapters;
      } else {
        response.messages.error.push("Lista rozdziałów jest pusta!");
        return res.status(404).json(response);
      }
    } else {
      response.messages.error.push("Nie posiadasz uprawnień!");
      return res.status(400).json(response);
    }
  } catch {
    response.messages.error.push("Nie można pobrać listy rozdziałów!");
    return res.status(500).json(response);
  }

  response.messages.chapters.push(listOfChapters);
  return res.status(200).json(response);
};

const takeAllTopicsWhichAreToRemove = async (res, dataFromAuth) => {
  const response = {
    messages: {
      message: [],
      error: [],
      topics: [],
    },
  };

  try {
    if (dataFromAuth.name === process.env.S3_ADMIN_PERMISSIONS) {
      const takeTopics = await takeAllTopicsWchichWereAssignedAsToRemove(
        Model.Topics
      );
      if (takeTopics !== false) {
        listOfTopics = takeTopics;
      } else {
        response.messages.error.push("Lista tematów jest pusta!");
        return res.status(404).json(response);
      }
    } else {
      response.messages.error.push("Nie posiadasz uprawnień!");
      return res.status(400).json(response);
    }
  } catch {
    response.messages.error.push("Nie można pobrać listy tematów!");
    return res.status(500).json(response);
  }

  response.messages.topics.push(listOfTopics);
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
exports.takeAllChaptersWhichAreToRemove = takeAllChaptersWhichAreToRemove;
exports.takeAllTopicsWhichAreToRemove = takeAllTopicsWhichAreToRemove;
