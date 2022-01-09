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
const Response = require("../Class/Response");

const createSchoolSubject = async (req, res, dataFromAuth) => {
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
          return res
            .status(400)
            .json(
              Response.returnError(
                "Nie udało się utworzyć nowego przedmiotu szkolnego!"
              )
            );
        }
      } else {
        return res
          .status(400)
          .json(Response.returnError("Przedmiot szkolny już istnieje!"));
      }
    } else {
      return res
        .status(400)
        .json(
          Response.returnError(
            "Nie posiadasz uprawnień, by móc dodać nowy rodział!"
          )
        );
    }
  } catch (err) {
    return res
      .status(500)
      .json(
        Response.returnError(
          "Nie można przeprowadzić procesu dodawania nowego przedmiotu szkolnego!"
        )
      );
  }

  return res
    .status(200)
    .json(Response.returnMessage("Pomyślnie dodano nowy przedmiot szkolny!"));
};

const removeSchoolSubject = async (req, res, dataFromAuth) => {
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
          return res
            .status(400)
            .json(
              Response.returnError("Nie udało się usunąć przedmiotu szkolnego!")
            );
        }
      } else {
        return res
          .status(400)
          .json(Response.returnError("Przedmiot szkolny nie istnieje!"));
      }
    } else {
      return res
        .status(400)
        .json(
          Response.returnError(
            "Nie posiadasz uprawnień, by móc dodać nowy rodział!"
          )
        );
    }
  } catch {
    return res
      .status(500)
      .json(
        Response.returnError(
          "Nie można przeprowadzić procesu usuwania przedmiotu szkolnego!"
        )
      );
  }

  return res
    .status(200)
    .json(Response.returnMessage("Pomyślnie usunięto przedmiot szkolny!"));
};

const removeChapter = async (req, res, dataFromAuth) => {
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
          res
            .status(400)
            .json(Response.returnError("Nie udało się usunąć rozdziału!"));
        }
      } else {
        return res
          .status(400)
          .json(Response.returnError("Rozdział nie istnieje!"));
      }
    } else {
      return res
        .status(400)
        .json(
          Response.returnError(
            "Nie posiadasz uprawnień, by móc dodać nowy rodział!"
          )
        );
    }
  } catch {
    return res
      .status(500)
      .json(
        Response.returnError(
          "Nie można przeprowadzić procesu usuwania rozdziału!"
        )
      );
  }

  return res
    .status(200)
    .json(Response.returnMessage("Pomyślnie usunięto rozdział!"));
};

const removeTopic = async (req, res, dataFromAuth) => {
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
          return res
            .status(400)
            .json(Response.returnError("Nie udało się usunąć tematu!"));
        }
      } else {
        return res
          .status(400)
          .json(Response.returnError("Temat nie istnieje!"));
      }
    } else {
      return res
        .status(400)
        .json(
          Response.returnError(
            "Nie posiadasz uprawnień, by móc dodać nowy rodział!"
          )
        );
    }
  } catch {
    return res
      .status(500)
      .json(
        Response.returnError("Nie można przeprowadzić procesu usuwania tematu!")
      );
  }

  return res
    .status(200)
    .json(Response.returnMessage("Pomyślnie usunięto temat!"));
};

const takeAllUsersToRemove = async (res, dataFromAuth) => {
  try {
    if (dataFromAuth.name === process.env.S3_ADMIN_PERMISSIONS) {
      const takeListOfUsers = await takeListOfUsersWhichAreToRemove(
        Model.Users
      );
      if (takeListOfUsers !== false) {
        listOfUsersToRemove = takeListOfUsers;
      } else {
        return res
          .status(404)
          .json(Response.returnError("Lista użytkowników jest pusta!"));
      }
    } else {
      return res
        .status(400)
        .json(Response.returnError("Nie posiadasz uprawnień!"));
    }
  } catch {
    return res
      .status(500)
      .json(Response.returnError("Nie można pobrać listy użytkowników!"));
  }

  return res.status(200).json(Response.returnUsers(listOfUsersToRemove));
};

const daleteUserAccount = async (req, res, dataFromAuth) => {
  const user = req.body.userId;

  try {
    if (dataFromAuth.name === process.env.S3_ADMIN_PERMISSIONS) {
      const findUser = await findUserById(Model.Users, user);
      if (findUser !== false) {
        const deleteUser = await deleteUserById(Model.Users, user);
        if (deleteUser === false) {
          return res
            .status(400)
            .send(Response.returnError("Nie udało się usunąć użytkownika!"));
        }
      } else {
        return res
          .status(400)
          .send(
            Response.returnError("Wybrane konto użytkownika nie istnieje!")
          );
      }
    } else {
      return res
        .status(400)
        .send(
          Response.returnError(
            "Nie posiadasz uprawnień, aby móc usunąć użytkownika!"
          )
        );
    }
  } catch {
    return res
      .status(500)
      .send(
        Response.returnError(
          "Nie udało się przeprowadzić procesu usuwania konta użytkownika!"
        )
      );
  }

  return res
    .status(200)
    .json(Response.returnMessage("Pomyślnie usunięto konto użytkownika!"));
};

const takeAllUsers = async (res, dataFromAuth) => {
  try {
    if (dataFromAuth.name === process.env.S3_ADMIN_PERMISSIONS) {
      const takeAdminRoleId = await findAdminRoleId(Model.TypesOfUsersRoles);
      if (takeAdminRoleId !== false) {
        const takeUsers = await takeListOfUsers(Model.Users, takeAdminRoleId);
        if (takeUsers !== false) {
          listOfUsers = takeUsers;
        } else {
          return res
            .status(404)
            .json(Response.returnError("Lista użytkowników jest pusta!"));
        }
      } else {
        return res
          .status(400)
          .json(Response.returnError("Nie odnaleziono roli użytkownika!"));
      }
    } else {
      return res
        .status(400)
        .json(Response.returnError("Nie posiadasz uprawnień!"));
    }
  } catch {
    return res
      .status(500)
      .json(Response.returnError("Nie można pobrać listy użytkowników!"));
  }

  return res.status(200).json(Response.returnUsers(listOfUsers));
};

const assignTeacherPermissions = async (req, res, dataFromAuth) => {
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
            return res
              .status(400)
              .json(
                Response.returnError(
                  "Nie udało się zmienić uprawnień wybranemu użytkownikowi!"
                )
              );
          }
        } else {
          return res
            .status(400)
            .json(
              Response.returnError(
                "Rola użytkownika - Nauczyciel - nie istnieje!"
              )
            );
        }
      } else {
        return res
          .status(400)
          .json(Response.returnError("Użytkownik nie istnieje!"));
      }
    } else {
      return res
        .status(400)
        .json(Response.returnError("Nie posiadasz uprawnień!"));
    }
  } catch {
    return res
      .status(500)
      .json(
        Response.returnError(
          "Nie można nadać uprawnień nauczyciela wybranemu użytkownikowi!"
        )
      );
  }

  return res
    .status(200)
    .json(
      Response.returnMessage("Pomyślnie zmieniono uprawnienia dla użytkownika!")
    );
};

const takeAllChaptersWhichAreToRemove = async (res, dataFromAuth) => {
  try {
    if (dataFromAuth.name === process.env.S3_ADMIN_PERMISSIONS) {
      const takeChapters = await takeAllChaptersWchichWereAssignedAsToRemove(
        Model.Chapters
      );
      if (takeChapters !== false) {
        listOfChapters = takeChapters;
      } else {
        return res
          .status(404)
          .json(Response.returnError("Lista rozdziałów jest pusta!"));
      }
    } else {
      return res
        .status(400)
        .json(Response.returnError("Nie posiadasz uprawnień!"));
    }
  } catch {
    return res
      .status(500)
      .json(Response.returnError("Nie można pobrać listy rozdziałów!"));
  }

  return res.status(200).json(Response.returnChapters(listOfChapters));
};

const takeAllTopicsWhichAreToRemove = async (res, dataFromAuth) => {
  try {
    if (dataFromAuth.name === process.env.S3_ADMIN_PERMISSIONS) {
      const takeTopics = await takeAllTopicsWchichWereAssignedAsToRemove(
        Model.Topics
      );
      if (takeTopics !== false) {
        listOfTopics = takeTopics;
      } else {
        return res
          .status(404)
          .json(Response.returnError("Lista tematów jest pusta!"));
      }
    } else {
      return res
        .status(400)
        .json(Response.returnError("Nie posiadasz uprawnień!"));
    }
  } catch {
    return res
      .status(500)
      .json(Response.returnError("Nie można pobrać listy tematów!"));
  }

  return res.status(200).json(Response.returnTopics(listOfTopics));
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
