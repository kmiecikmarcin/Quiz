const express = require("express");
const { check, validationResult } = require("express-validator");
const verifyToken = require("../Functions/Others/verifyToken");
const administrationsControllers = require("../Controllers/administration");

const router = express.Router();

router.post(
  "/schoolSubject",
  [
    check("nameOfSchoolSubject")
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
  (req, res) => {
    const response = {
      messages: {
        message: [],
        error: [],
      },
    };

    const error = validationResult(req);
    const validationHeaderResults = verifyToken(req);

    if (!error.isEmpty()) {
      response.validationErrors = error
        .array({ onlyFirstError: true })
        .map((err) => ({ [err.param]: err.msg }));
      res.status(400).json(response);
    } else if (validationHeaderResults === false) {
      response.messages.error.push(
        "Nie udało się przeprowadzić procesu uwierzytelniania!"
      );
      res.status(403).send(response);
    } else {
      administrationsControllers.createSchoolSubject(req, res);
    }
  }
);

router.delete(
  "/subject",
  [
    check("nameOfSchoolSubject")
      .exists()
      .withMessage("Brak wymaganych danych!")
      .isLength({ min: 3 })
      .withMessage("Wprowadzony nazwa jest za krótka!")
      .isLength({ max: 24 }),
  ],
  (req, res) => {
    const response = {
      messages: {
        message: [],
        error: [],
      },
    };

    const error = validationResult(req);
    const validationHeaderResults = verifyToken(req);

    if (!error.isEmpty()) {
      response.validationErrors = error
        .array({ onlyFirstError: true })
        .map((err) => ({ [err.param]: err.msg }));
      res.status(400).json(response);
    } else if (validationHeaderResults === false) {
      response.messages.error.push(
        "Nie udało się przeprowadzić procesu uwierzytelniania!"
      );
      res.status(403).send(response);
    } else {
      administrationsControllers.removeSchoolSubject(req, res);
    }
  }
);

router.delete(
  "/chapter",
  [
    check("nameOfChapter")
      .exists()
      .withMessage("Brak wymaganych danych!")
      .isLength({ min: 3 })
      .withMessage("Wprowadzony nazwa jest za krótka!")
      .isLength({ max: 64 }),
  ],
  (req, res) => {
    const response = {
      messages: {
        message: [],
        error: [],
      },
    };

    const error = validationResult(req);
    const validationHeaderResults = verifyToken(req);

    if (!error.isEmpty()) {
      response.validationErrors = error
        .array({ onlyFirstError: true })
        .map((err) => ({ [err.param]: err.msg }));
      res.status(400).json(response);
    } else if (validationHeaderResults === false) {
      response.messages.error.push(
        "Nie udało się przeprowadzić procesu uwierzytelniania!"
      );
      res.status(403).send(response);
    } else {
      administrationsControllers.removeChapter(req, res);
    }
  }
);

router.delete(
  "/topic",
  [
    check("nameOfTopic")
      .exists()
      .withMessage("Brak wymaganych danych!")
      .isLength({ min: 3 })
      .withMessage("Wprowadzony nazwa jest za krótka!")
      .isLength({ max: 64 })
      .withMessage("Wprowadzony nazwa jest za długa!"),
  ],
  (req, res) => {
    const response = {
      messages: {
        message: [],
        error: [],
      },
    };

    const error = validationResult(req);
    const validationHeaderResults = verifyToken(req);

    if (!error.isEmpty()) {
      response.validationErrors = error
        .array({ onlyFirstError: true })
        .map((err) => ({ [err.param]: err.msg }));
      res.status(400).json(response);
    } else if (validationHeaderResults === false) {
      response.messages.error.push(
        "Nie udało się przeprowadzić procesu uwierzytelniania!"
      );
      res.status(403).send(response);
    } else {
      administrationsControllers.removeTopic(req, res);
    }
  }
);

router.get("/users-to-remove", (req, res) => {
  const response = {
    messages: {
      message: [],
      error: [],
    },
  };

  const headerValidationResults = verifyToken(req);

  if (headerValidationResults === false) {
    response.messages.error.push(
      "Nie udało się przeprowadzić procesu uwierzytelniania!"
    );
    res.status(403).send(response);
  } else {
    administrationsControllers.takeAllUsersToRemove(req, res);
  }
});

router.delete(
  "/user",
  [
    check("userId")
      .exists()
      .withMessage("Brak wymaganych danych!")
      .isUUID()
      .withMessage("Niepoprawny format id użytkownika"),
  ],
  (req, res) => {
    const response = {
      messages: {
        message: [],
        error: [],
      },
    };

    const error = validationResult(req);
    const validationHeaderResults = verifyToken(req);

    if (!error.isEmpty()) {
      response.validationErrors = error
        .array({ onlyFirstError: true })
        .map((err) => ({ [err.param]: err.msg }));
      res.status(400).json(response);
    } else if (validationHeaderResults === false) {
      response.messages.error.push(
        "Nie udało się przeprowadzić procesu uwierzytelniania!"
      );
      res.status(403).send(response);
    } else {
      administrationsControllers.daleteUserAccount(req, res);
    }
  }
);

router.get("/users", (req, res) => {
  const response = {
    messages: {
      message: [],
      error: [],
    },
  };

  const headerValidationResults = verifyToken(req);

  if (headerValidationResults === false) {
    response.messages.error.push(
      "Nie udało się przeprowadzić procesu uwierzytelniania!"
    );
    res.status(403).send(response);
  } else {
    administrationsControllers.takeAllUsers(req, res);
  }
});

router.patch(
  "/permissions",
  [
    check("userId")
      .exists()
      .withMessage("Brak wymaganych danych!")
      .isUUID()
      .withMessage("Niepoprawny format id użytkownika"),
  ],
  (req, res) => {
    const response = {
      messages: {
        message: [],
        error: [],
      },
    };

    const error = validationResult(req);
    const validationHeaderResults = verifyToken(req);

    if (!error.isEmpty()) {
      response.validationErrors = error
        .array({ onlyFirstError: true })
        .map((err) => ({ [err.param]: err.msg }));
      res.status(400).json(response);
    } else if (validationHeaderResults === false) {
      response.messages.error.push(
        "Nie udało się przeprowadzić procesu uwierzytelniania!"
      );
      res.status(403).send(response);
    } else {
      administrationsControllers.assignTeacherPermissions(req, res);
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
