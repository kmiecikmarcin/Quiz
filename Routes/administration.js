const express = require("express");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const verifyToken = require("../Functions/Others/verifyToken");
const checkTheSchoolSubjectExists = require("../Functions/SchoolSubjects/checkTheSchoolSubjectExists");
const Model = require("../Functions/Others/takeModels");
const createNewSchoolSubject = require("../Functions/SchoolSubjects/createNewSchoolSubject");
const checkExistsOfUserEmail = require("../Functions/Users/checkExistsOfUserEmail");
const removeSchoolSubjectFromDatabase = require("../Functions/SchoolSubjects/removeSchoolSubjectFromDatabase");

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
        // eslint-disable-next-line no-useless-escape
        const badSpecialKeys = /[\,\+\=\.\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-\@\#\!\$\%\^\&\*]/.test(
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
                const checkSchoolSubjectExist = await checkTheSchoolSubjectExists(
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
                const checkSchoolSubjectExist = await checkTheSchoolSubjectExists(
                  Model.SchoolSubjects,
                  req.body.name_of_school_subject
                );
                if (checkSchoolSubjectExist !== false) {
                  const deleteSchoolSubject = await removeSchoolSubjectFromDatabase(
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
                  error: "Nie posiadasz uprawnień, by móc dodać nowy rodział!",
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
