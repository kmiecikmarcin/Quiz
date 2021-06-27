const express = require("express");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const verifyToken = require("../Functions/Others/verifyToken");
const checkTheSchoolSubjectExists = require("../Functions/SchoolSubjects/checkTheSchoolSubjectExists");
const Model = require("../Functions/Others/takeModels");
const createNewSchoolSubject = require("../Functions/SchoolSubjects/createNewSchoolSubject");
const checkExistsOfUserEmail = require("../Functions/Users/checkExistsOfUserEmail");
const removeSchoolSubjectFromDatabase = require("../Functions/SchoolSubjects/removeSchoolSubjectFromDatabase");
const checkTheChapterExists = require("../Functions/SchoolSubjects/checkTheChapterExists");
const removeChapterFromDatabase = require("../Functions/SchoolSubjects/removeChapterFromDatabase");
const checkTheTopicExists = require("../Functions/SchoolSubjects/checkTheTopicExists");
const removeTopicFromDatabase = require("../Functions/SchoolSubjects/removeTopicFromDatabase");
const takeListOfUsersWhichAreToRemove = require("../Functions/Users/takeListOfUsersWhichAreToRemove");
const deleteUserById = require("../Functions/Users/deleteUserById");
const findUserById = require("../Functions/Users/findUserById");
const findIdOfTeacherPermission = require("../Functions/Users/findIdOfTeacherPermission");
const updateUserPermissionToTeacherPermissions = require("../Functions/Users/updateUserPermissionToTeacherPermissions");
const takeAllUsers = require("../Functions/Users/takeAllUsers");
const findAdminRoleId = require("../Functions/Users/findAdminRoleId");

const router = express.Router();

router.post(
  "/schoolSubject",
  [
    check("name_of_school_subject")
      .exists()
      .withMessage("Brak wymaganych danych!")
      .isLength({ min: 3 })
      .withMessage("Wprowadzony nazwa jest za krótka!")
      .isLength({ max: 24 })
      .withMessage("Wprowadzony nazwa jest za długa!")
      .custom((value) => {
        const badSpecialKeys =
          // eslint-disable-next-line no-useless-escape
          /[\,\+\=\.\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-\@\#\!\$\%\^\&\*]/.test(
            value
          );
        if (badSpecialKeys === true) {
          throw new Error("Nazwa zawiera nieprawidłowy znak!");
        } else {
          return value;
        }
      }),
  ],
  verifyToken,
  (req, res) => {
    const error = validationResult(req);
    const response = {
      messages: {},
      validationErrors: [],
    };

    if (!error.isEmpty()) {
      response.validationErrors = error
        .array({ onlyFirstError: true })
        .map((err) => ({ [err.param]: err.msg }));
      res.status(400).json(response);
    } else {
      jwt.verify(
        req.token,
        process.env.S3_SECRETKEY,
        async (jwtError, authData) => {
          if (jwtError) {
            response.messages = { error: "Błąd uwierzytelniania!" };
            res.status(403).json(response);
          } else {
            const checkUser = await checkExistsOfUserEmail(
              Model.Users,
              authData.email
            );
            if (checkUser !== false) {
              if (authData.name === process.env.S3_ADMIN_PERMISSIONS) {
                const checkSchoolSubjectExist =
                  await checkTheSchoolSubjectExists(
                    Model.SchoolSubjects,
                    req.body.name_of_school_subject
                  );
                if (checkSchoolSubjectExist === false) {
                  const newSchoolSubject = await createNewSchoolSubject(
                    Model.SchoolSubjects,
                    req.body.name_of_school_subject
                  );
                  if (newSchoolSubject !== false) {
                    response.messages = {
                      message: "Pomyślnie dodano nowy przedmiot szkolny!",
                    };
                    res.status(201).json(response);
                  } else {
                    response.messages = {
                      error:
                        "Nie udało się utworzyć nowego przedmiotu szkolnego!",
                    };
                    res.status(400).json(response);
                  }
                } else {
                  response.messages = {
                    error: "Przedmiot szkolny już istnieje!",
                  };
                  res.status(400).json(response);
                }
              } else {
                response.messages = {
                  error:
                    "Nie posiadasz uprawnień, by móc dodać nowy przedmiot szkolny!",
                };
                res.status(400).json(response);
              }
            } else {
              response.messages = { error: "Użytkownik nie istnieje!" };
              res.status(400).json(response);
            }
          }
        }
      );
    }
  }
);

router.delete(
  "/subject",
  [
    check("name_of_school_subject")
      .exists()
      .withMessage("Brak wymaganych danych!")
      .isLength({ min: 3 })
      .withMessage("Wprowadzony nazwa jest za krótka!")
      .isLength({ max: 24 }),
  ],
  verifyToken,
  (req, res) => {
    const error = validationResult(req);
    const response = {
      messages: {},
      validationErrors: [],
    };

    if (!error.isEmpty()) {
      response.validationErrors = error
        .array({ onlyFirstError: true })
        .map((err) => ({ [err.param]: err.msg }));
      res.status(400).json(response);
    } else {
      jwt.verify(
        req.token,
        process.env.S3_SECRETKEY,
        async (jwtError, authData) => {
          if (jwtError) {
            response.messages = { error: "Błąd uwierzytelniania!" };
            res.status(403).json(response);
          } else {
            const checkUser = await checkExistsOfUserEmail(
              Model.Users,
              authData.email
            );
            if (checkUser !== false) {
              if (authData.name === process.env.S3_ADMIN_PERMISSIONS) {
                const checkSchoolSubjectExist =
                  await checkTheSchoolSubjectExists(
                    Model.SchoolSubjects,
                    req.body.name_of_school_subject
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
                  if (deleteSchoolSubject !== false) {
                    response.messages = {
                      message: "Pomyślnie usunięto przedmiot szkolny!",
                    };
                    res.status(200).json(response);
                  } else {
                    response.messages = {
                      error: "Nie udało się usunąć przedmiotu szkolnego!",
                    };
                    res.status(400).json(response);
                  }
                } else {
                  response.messages = {
                    error: "Przedmiot szkolny nie istnieje!",
                  };
                  res.status(400).json(response);
                }
              } else {
                response.messages = {
                  error:
                    "Nie posiadasz uprawnień, by móc usunąć przedmiot szkolny!",
                };
                res.status(400).json(response);
              }
            } else {
              response.messages = { error: "Użytkownik nie istnieje!" };
              res.status(400).json(response);
            }
          }
        }
      );
    }
  }
);

router.delete(
  "/chapter",
  [
    check("name_of_chapter")
      .exists()
      .withMessage("Brak wymaganych danych!")
      .isLength({ min: 3 })
      .withMessage("Wprowadzony nazwa jest za krótka!")
      .isLength({ max: 64 }),
  ],
  verifyToken,
  (req, res) => {
    const error = validationResult(req);
    const response = {
      messages: {},
      validationErrors: [],
    };

    if (!error.isEmpty()) {
      response.validationErrors = error
        .array({ onlyFirstError: true })
        .map((err) => ({ [err.param]: err.msg }));
      res.status(400).json(response);
    } else {
      jwt.verify(
        req.token,
        process.env.S3_SECRETKEY,
        async (jwtError, authData) => {
          if (jwtError) {
            response.messages = { error: "Błąd uwierzytelniania!" };
            res.status(403).json(response);
          } else {
            const checkUser = await checkExistsOfUserEmail(
              Model.Users,
              authData.email
            );
            if (checkUser !== false) {
              if (authData.name === process.env.S3_ADMIN_PERMISSIONS) {
                const checkChapter = await checkTheChapterExists(
                  Model.Chapters,
                  req.body.name_of_chapter
                );
                if (checkChapter !== false) {
                  const deleteChapter = await removeChapterFromDatabase(
                    res,
                    Model.Chapters,
                    Model.Topics,
                    req.body.name_of_chapter,
                    checkChapter
                  );
                  if (deleteChapter === true) {
                    response.messages = {
                      message: "Pomyślnie usunięto rozdział!",
                    };
                    res.status(200).json(response);
                  } else {
                    response.messages = {
                      error: "Nie udało się usunąć rozdziału!",
                    };
                    res.status(400).json(response);
                  }
                } else {
                  response.messages = {
                    error: "Rozdział nie istnieje!",
                  };
                  res.status(400).json(response);
                }
              } else {
                response.messages = {
                  error: "Nie posiadasz uprawnień, by móc usunąć rodział!",
                };
                res.status(400).json(response);
              }
            } else {
              response.messages = { error: "Użytkownik nie istnieje!" };
              res.status(400).json(response);
            }
          }
        }
      );
    }
  }
);

router.delete(
  "/topic",
  [
    check("name_of_topic")
      .exists()
      .withMessage("Brak wymaganych danych!")
      .isLength({ min: 3 })
      .withMessage("Wprowadzony nazwa jest za krótka!")
      .isLength({ max: 64 })
      .withMessage("Wprowadzony nazwa jest za długa!"),
  ],
  verifyToken,
  (req, res) => {
    const error = validationResult(req);
    const response = {
      messages: {},
      validationErrors: [],
    };

    if (!error.isEmpty()) {
      response.validationErrors = error
        .array({ onlyFirstError: true })
        .map((err) => ({ [err.param]: err.msg }));
      res.status(400).json(response);
    } else {
      jwt.verify(
        req.token,
        process.env.S3_SECRETKEY,
        async (jwtError, authData) => {
          if (jwtError) {
            response.messages = { error: "Błąd uwierzytelniania!" };
            res.status(403).json(response);
          } else {
            const checkUser = await checkExistsOfUserEmail(
              Model.Users,
              authData.email
            );
            if (checkUser !== false) {
              if (authData.name === process.env.S3_ADMIN_PERMISSIONS) {
                const checkTopic = await checkTheTopicExists(
                  Model.Topics,
                  req.body.name_of_topic
                );
                if (checkTopic !== false) {
                  const deleteTopic = await removeTopicFromDatabase(
                    Model.Topics,
                    checkTopic,
                    req.body.name_of_topic
                  );
                  if (deleteTopic !== false) {
                    response.messages = {
                      message: "Pomyślnie usunięto temat!",
                    };
                    res.status(200).json(response);
                  } else {
                    response.messages = {
                      error: "Nie udało się usunąć tematu!",
                    };
                    res.status(400).json(response);
                  }
                } else {
                  response.messages = {
                    error: "Temat nie istnieje!",
                  };
                  res.status(400).json(response);
                }
              } else {
                response.messages = {
                  error: "Nie posiadasz uprawnień, by móc usunąć temat!",
                };
                res.status(400).json(response);
              }
            } else {
              response.messages = { error: "Użytkownik nie istnieje!" };
              res.status(400).json(response);
            }
          }
        }
      );
    }
  }
);

router.get("/users", verifyToken, (req, res) => {
  const response = {
    messages: {},
    listOfUsers: [],
  };
  jwt.verify(
    req.token,
    process.env.S3_SECRETKEY,
    async (jwtError, authData) => {
      if (jwtError) {
        response.messages = { error: "Błąd uwierzytelniania!" };
        res.status(403).json(response);
      } else {
        const checkUser = await checkExistsOfUserEmail(
          Model.Users,
          authData.email
        );
        if (checkUser !== false) {
          if (authData.name === process.env.S3_ADMIN_PERMISSIONS) {
            const takeListOfUsers = await takeListOfUsersWhichAreToRemove(
              Model.Users
            );
            if (takeListOfUsers !== false) {
              response.listOfUsers = takeListOfUsers;
              res.status(200).json(response);
            } else {
              response.messages = {
                error: "Nie udało się pobrać listy użytkowników!",
              };
              res.status(400).json(response);
            }
          } else {
            response.messages = {
              error: "Nie posiadasz uprawnień!",
            };
            res.status(400).json(response);
          }
        } else {
          response.messages = { error: "Użytkownik nie istnieje!" };
          res.status(400).json(response);
        }
      }
    }
  );
});

router.delete(
  "/user",
  [
    check("user_id")
      .exists()
      .withMessage("Brak wymaganych danych!")
      .isUUID()
      .withMessage("Niepoprawny format id użytkownika"),
  ],
  verifyToken,
  (req, res) => {
    const error = validationResult(req);
    const response = {
      messages: {},
      validationErrors: [],
    };
    if (!error.isEmpty()) {
      response.validationErrors = error
        .array({ onlyFirstError: true })
        .map((err) => ({ [err.param]: err.msg }));
      res.status(400).json(response);
    } else {
      jwt.verify(
        req.token,
        process.env.S3_SECRETKEY,
        async (jwtError, authData) => {
          if (jwtError) {
            response.messages = { error: "Błąd uwierzytelniania!" };
            res.status(403).json(response);
          } else {
            const checkUser = await checkExistsOfUserEmail(
              Model.Users,
              authData.email
            );
            if (checkUser !== false) {
              if (authData.name === process.env.S3_ADMIN_PERMISSIONS) {
                const findUser = await findUserById(
                  Model.Users,
                  req.body.user_id
                );
                if (findUser !== false) {
                  const deleteUser = await deleteUserById(
                    Model.Users,
                    req.body.user_id
                  );
                  if (deleteUser !== false) {
                    response.messages = {
                      message: "Pomyślnie usunięto użytkownika!",
                    };
                    res.status(200).json(response);
                  } else {
                    response.messages = {
                      error: "Nie udało się usunąć użytkownika!",
                    };
                    res.status(400).json(response);
                  }
                } else {
                  response.messages = {
                    error: "Użytkownik nie istnieje!",
                  };
                  res.status(404).json(response);
                }
              } else {
                response.messages = {
                  error: "Nie posiadasz uprawnień, aby móc usunąć użytkownika!",
                };
                res.status(400).json(response);
              }
            } else {
              response.messages = { error: "Użytkownik nie istnieje!" };
              res.status(400).json(response);
            }
          }
        }
      );
    }
  }
);

router.get("/allUsers", verifyToken, (req, res) => {
  const response = {
    messages: {},
    listOfUsers: [],
  };
  jwt.verify(
    req.token,
    process.env.S3_SECRETKEY,
    async (jwtError, authData) => {
      if (jwtError) {
        response.messages = { error: "Błąd uwierzytelniania!" };
        res.status(403).json(response);
      } else {
        const checkUser = await checkExistsOfUserEmail(
          Model.Users,
          authData.email
        );
        if (checkUser !== false) {
          if (authData.name === process.env.S3_ADMIN_PERMISSIONS) {
            const takeAdminRoleId = await findAdminRoleId(
              Model.TypesOfUsersRoles
            );
            const takeListOfUsers = await takeAllUsers(
              Model.Users,
              takeAdminRoleId
            );
            if (takeListOfUsers !== false) {
              response.listOfUsers = takeListOfUsers;
              res.status(200).json(response);
            } else {
              response.messages = {
                error: "Nie udało się pobrać listy użytkowników!",
              };
              res.status(400).json(response);
            }
          } else {
            response.messages = {
              error: "Nie posiadasz uprawnień!",
            };
            res.status(400).json(response);
          }
        } else {
          response.messages = { error: "Użytkownik nie istnieje!" };
          res.status(400).json(response);
        }
      }
    }
  );
});

router.put(
  "/permissions",
  [
    check("user_id")
      .exists()
      .withMessage("Brak wymaganych danych!")
      .isUUID()
      .withMessage("Niepoprawny format id użytkownika"),
  ],
  verifyToken,
  (req, res) => {
    const error = validationResult(req);
    const response = {
      messages: {},
      validationErrors: [],
    };
    if (!error.isEmpty()) {
      response.validationErrors = error
        .array({ onlyFirstError: true })
        .map((err) => ({ [err.param]: err.msg }));
      res.status(400).json(response);
    } else {
      jwt.verify(
        req.token,
        process.env.S3_SECRETKEY,
        async (jwtError, authData) => {
          if (jwtError) {
            response.messages = { error: "Błąd uwierzytelniania!" };
            res.status(403).json(response);
          } else {
            const checkUser = await checkExistsOfUserEmail(
              Model.Users,
              authData.email
            );
            if (checkUser !== false) {
              if (authData.name === process.env.S3_ADMIN_PERMISSIONS) {
                const findUser = await findUserById(
                  Model.Users,
                  req.body.user_id
                );
                if (findUser !== false) {
                  const findIdOfTeacher = await findIdOfTeacherPermission(
                    Model.TypesOfUsersRoles
                  );
                  if (findIdOfTeacher !== false) {
                    const updatePermission =
                      await updateUserPermissionToTeacherPermissions(
                        Model.Users,
                        findIdOfTeacher,
                        req.body.user_id
                      );
                    if (updatePermission !== false) {
                      response.messages = {
                        message:
                          "Pomyślnie zmieniono uprawnienia dla użytkownika!",
                      };
                      res.status(200).json(response);
                    } else {
                      response.messages = {
                        error:
                          "Nie udało się zmienić uprawnień wybranemu użytkownikowi!",
                      };
                      res.status(400).json(response);
                    }
                  } else {
                    response.messages = {
                      error: "Wybrana rola użytkownika nie istnieje!",
                    };
                    res.status(404).json(response);
                  }
                } else {
                  response.messages = {
                    error: "Użytkownik nie istnieje!",
                  };
                  res.status(404).json(response);
                }
              } else {
                response.messages = {
                  error:
                    "Nie posiadasz uprawnień, aby zmienić uprawnienia dla użytkownika!",
                };
                res.status(400).json(response);
              }
            } else {
              response.messages = { error: "Użytkownik nie istnieje!" };
              res.status(400).json(response);
            }
          }
        }
      );
    }
  }
);

module.exports = router;
