const express = require("express");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const verifyToken = require("../Functions/Others/verifyToken");
const checkExistsOfUserEmail = require("../Functions/Users/checkExistsOfUserEmail");
const Model = require("../Functions/Others/takeModels");
const takeDataAboutChaptersAndTopics = require("../Functions/SchoolSubjects/takeDataAboutChaptersAndTopics");
const checkTheChapterIsUnique = require("../Functions/SchoolSubjects/checkTheChapterIsUnique");
const checkTheSubjectExists = require("../Functions/SchoolSubjects/checkTheSubjectExists");
const createNewChapter = require("../Functions/SchoolSubjects/createNewChapter");
const checkTheChapterExists = require("../Functions/SchoolSubjects/checkTheChapterExists");
const checkTheTopicIsUnique = require("../Functions/SchoolSubjects/checkTheTopicIsUnique");
const createNewTopic = require("../Functions/SchoolSubjects/createNewTopic");
const chapterToBeDeleted = require("../Functions/SchoolSubjects/chapterToBeDeleted");
const checkChapterAssignedToTopics = require("../Functions/SchoolSubjects/checkChapterAssignedToTopics");
const takeDataAboutSchoolSubjects = require("../Functions/SchoolSubjects/takeDataAboutSchoolSubjects");
const checkTheTopicExists = require("../Functions/SchoolSubjects/checkTheTopicExists");
const topicToBeDeleted = require("../Functions/SchoolSubjects/topicToBeDeleted");

const router = express.Router();

router.get("/subjects", verifyToken, (req, res) => {
  jwt.verify(
    req.token,
    process.env.S3_SECRETKEY,
    async (jwtError, authData) => {
      if (jwtError) {
        res.status(403).json({ Error: "Błąd uwierzytelniania!" });
      } else {
        const checkUser = await checkExistsOfUserEmail(
          Model.Users,
          authData.email
        );
        if (checkUser !== false) {
          const takeSchoolSubjects = await takeDataAboutSchoolSubjects(
            Model.SchoolSubjects
          );
          if (takeSchoolSubjects !== false) {
            res.status(200).json(takeSchoolSubjects);
          } else {
            res.status(501).json({ Error: "Brak przedmiotów szkolnych!" });
          }
        } else {
          res.status(400).json({ Error: "Użytkownik nie istnieje!" });
        }
      }
    }
  );
});

router.get("/chapters", verifyToken, (req, res) => {
  jwt.verify(
    req.token,
    process.env.S3_SECRETKEY,
    async (jwtError, authData) => {
      if (jwtError) {
        res.status(403).json({ Error: "Błąd uwierzytelniania!" });
      } else {
        const checkUser = await checkExistsOfUserEmail(
          Model.Users,
          authData.email
        );
        if (checkUser !== false) {
          const takeChapters = await takeDataAboutChaptersAndTopics(
            Model.Chapters
          );
          if (takeChapters !== false) {
            res.status(200).json(takeChapters);
          } else {
            res.status(404).json({ Error: "Brak rozdziałów w systemie!" });
          }
        } else {
          res.status(400).json({ Error: "Użytkownik nie istnieje!" });
        }
      }
    }
  );
});

router.get("/topics", verifyToken, (req, res) => {
  jwt.verify(
    req.token,
    process.env.S3_SECRETKEY,
    async (jwtError, authData) => {
      if (jwtError) {
        res.status(403).json({ Error: "Błąd uwierzytelniania!" });
      } else {
        const checkUser = await checkExistsOfUserEmail(
          Model.Users,
          authData.email
        );
        if (checkUser !== false) {
          const takeTopics = await takeDataAboutChaptersAndTopics(Model.Topics);
          if (takeTopics !== false) {
            res.status(200).json(takeTopics);
          } else {
            res.status(404).json({ Error: "Brak tematów w systemie!" });
          }
        } else {
          res.status(400).json({ Error: "Użytkownik nie istnieje!" });
        }
      }
    }
  );
});

router.post(
  "/chapter",
  [
    check("name_of_subject")
      .exists()
      .withMessage("Brak wymaganych danych!")
      .isLength({ min: 3 })
      .withMessage("Wprowadzony nazwa jest za krótka!")
      .isLength({ max: 64 })
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
    check("name_of_chapter")
      .exists()
      .withMessage("Brak wymaganych danych!")
      .isLength({ min: 3 })
      .withMessage("Wprowadzony nazwa jest za krótka!")
      .isLength({ max: 64 })
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

    if (!error.isEmpty()) {
      res.status(400).json(error.mapped());
    } else {
      jwt.verify(
        req.token,
        process.env.S3_SECRETKEY,
        async (jwtError, authData) => {
          if (jwtError) {
            res.status(403).json({ Error: "Błąd uwierzytelniania!" });
          } else {
            const checkUser = await checkExistsOfUserEmail(
              Model.Users,
              authData.email
            );
            if (checkUser !== false) {
              if (
                authData.name === process.env.S3_TEACHER_PERMISSIONS ||
                authData.name === process.env.S3_ADMIN_PERMISSIONS
              ) {
                const resposneAboutSubjectExists = await checkTheSubjectExists(
                  Model.SchoolSubjects,
                  req.body.name_of_subject
                );
                if (resposneAboutSubjectExists !== false) {
                  const responseAboutUniquenessOfChapter = await checkTheChapterIsUnique(
                    Model.Chapters,
                    req.body.name_of_chapter
                  );
                  if (responseAboutUniquenessOfChapter === true) {
                    const addNewChapter = await createNewChapter(
                      Model.Chapters,
                      resposneAboutSubjectExists,
                      req.body.name_of_chapter
                    );
                    if (addNewChapter !== false) {
                      res
                        .status(201)
                        .json({ Message: "Pomyślnie dodano nowy rozdział!" });
                    } else {
                      res.status(400).json({
                        Error:
                          "Nie udało się dodać nowego rodziału! Sprawdź wprowadzone dane.",
                      });
                    }
                  } else {
                    res.status(400).json({
                      Error: "Rozdział o wprowadzonej nazwie już istnieje!",
                    });
                  }
                } else {
                  res
                    .status(400)
                    .json({ Error: "Wybrany przedmiot szkolny nie istnieje!" });
                }
              } else {
                res.status(400).json({
                  Error: "Nie posiadasz uprawnień, by móc dodać nowy rodział!",
                });
              }
            } else {
              res.status(400).json({ Error: "Użytkownik nie istnieje!" });
            }
          }
        }
      );
    }
  }
);

router.post(
  "/topic",
  [
    check("name_of_chapter")
      .exists()
      .withMessage("Brak wymaganych danych!")
      .isLength({ min: 3 })
      .withMessage("Wprowadzony nazwa jest za krótka!")
      .isLength({ max: 64 })
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
    check("name_of_topic")
      .exists()
      .withMessage("Brak wymaganych danych!")
      .isLength({ min: 3 })
      .withMessage("Wprowadzony nazwa jest za krótka!")
      .isLength({ max: 64 })
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

    if (!error.isEmpty()) {
      res.status(400).json(error.mapped());
    } else {
      jwt.verify(
        req.token,
        process.env.S3_SECRETKEY,
        async (jwtError, authData) => {
          if (jwtError) {
            res.status(403).json({ Error: "Błąd uwierzytelniania!" });
          } else {
            const checkUser = await checkExistsOfUserEmail(
              Model.Users,
              authData.email
            );
            if (checkUser !== false) {
              if (
                authData.name === process.env.S3_TEACHER_PERMISSIONS ||
                authData.name === process.env.S3_ADMIN_PERMISSIONS
              ) {
                const resposneAboutChapterExists = await checkTheChapterExists(
                  Model.Chapters,
                  req.body.name_of_chapter
                );
                if (resposneAboutChapterExists !== false) {
                  const responseAboutUniquenessOfTopic = await checkTheTopicIsUnique(
                    Model.Topics,
                    req.body.name_of_topic
                  );
                  if (responseAboutUniquenessOfTopic === true) {
                    const addNewChapter = await createNewTopic(
                      Model.Topics,
                      resposneAboutChapterExists,
                      req.body.name_of_topic
                    );
                    if (addNewChapter !== false) {
                      res
                        .status(201)
                        .json({ Message: "Pomyślnie dodano nowy temat!" });
                    } else {
                      res.status(400).json({
                        Error:
                          "Nie udało się dodać nowego tematu! Sprawdź wprowadzone dane.",
                      });
                    }
                  } else {
                    res.status(400).json({
                      Error: "Temat o wprowadzonej nazwie już istnieje!",
                    });
                  }
                } else {
                  res
                    .status(400)
                    .json({ Error: "Wybrany rozdział nie istnieje!" });
                }
              } else {
                res.status(400).json({
                  Error: "Nie posiadasz uprawnień, by móc dodać nowy temat!",
                });
              }
            } else {
              res.status(400).json({ Error: "Użytkownik nie istnieje!" });
            }
          }
        }
      );
    }
  }
);

router.put(
  "/update-chapter",
  [
    check("name_of_chapter")
      .exists()
      .withMessage("Brak wymaganych danych!")
      .isLength({ min: 3 })
      .withMessage("Wprowadzony nazwa jest za krótka!")
      .isLength({ max: 64 })
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

    if (!error.isEmpty()) {
      res.status(400).json(error.mapped());
    } else {
      jwt.verify(
        req.token,
        process.env.S3_SECRETKEY,
        async (jwtError, authData) => {
          if (jwtError) {
            res.status(403).json({ Error: "Błąd uwierzytelniania!" });
          } else {
            const checkUser = await checkExistsOfUserEmail(
              Model.Users,
              authData.email
            );
            if (checkUser !== false) {
              if (
                authData.name === process.env.S3_TEACHER_PERMISSIONS ||
                authData.name === process.env.S3_ADMIN_PERMISSIONS
              ) {
                const resposneAboutChapterExists = await checkTheChapterExists(
                  Model.Chapters,
                  req.body.name_of_chapter
                );
                if (resposneAboutChapterExists !== false) {
                  const checkChapter = await checkChapterAssignedToTopics(
                    Model.Topics,
                    resposneAboutChapterExists
                  );
                  if (checkChapter !== true) {
                    const deleteChapter = await chapterToBeDeleted(
                      Model.Chapters,
                      resposneAboutChapterExists
                    );
                    if (deleteChapter !== false) {
                      res
                        .status(200)
                        .json({ Message: "Pomyślnie usunięto rozdział!" });
                    } else {
                      res.status(400).json({
                        Error: "Nie udało się usunąć wybranego rozdziału!",
                      });
                    }
                  } else {
                    res.status(400).json({
                      Error: "Rozdział posiada przypisane do siebie tematy.",
                    });
                  }
                } else {
                  res
                    .status(404)
                    .json({ Error: "Wybrany rozdział nie istnieje!" });
                }
              } else {
                res.status(400).json({
                  Error: "Nie posiadasz uprawnień, by móc dodać nowy temat!",
                });
              }
            } else {
              res.status(400).json({ Error: "Użytkownik nie istnieje!" });
            }
          }
        }
      );
    }
  }
);

router.put(
  "/update-topic",
  [
    check("name_of_topic")
      .exists()
      .withMessage("Brak wymaganych danych!")
      .isLength({ min: 3 })
      .withMessage("Wprowadzony nazwa jest za krótka!")
      .isLength({ max: 64 })
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

    if (!error.isEmpty()) {
      res.status(400).json(error.mapped());
    } else {
      jwt.verify(
        req.token,
        process.env.S3_SECRETKEY,
        async (jwtError, authData) => {
          if (jwtError) {
            res.status(403).json({ Error: "Błąd uwierzytelniania!" });
          } else {
            const checkUser = await checkExistsOfUserEmail(
              Model.Users,
              authData.email
            );
            if (checkUser !== false) {
              if (
                authData.name === process.env.S3_TEACHER_PERMISSIONS ||
                authData.name === process.env.S3_ADMIN_PERMISSIONS
              ) {
                const resposneAboutTopicExists = await checkTheTopicExists(
                  Model.Topics,
                  req.body.name_of_topic
                );
                if (resposneAboutTopicExists !== false) {
                  const deleteTopic = await topicToBeDeleted(
                    Model.Topics,
                    resposneAboutTopicExists
                  );
                  if (deleteTopic !== false) {
                    res
                      .status(200)
                      .json({ Message: "Pomyślnie usunięto temat!" });
                  } else {
                    res.status(400).json({
                      Error: "Nie udało się usunąć wybranego tematu!",
                    });
                  }
                } else {
                  res
                    .status(404)
                    .json({ Error: "Wybrany temat nie istnieje!" });
                }
              } else {
                res.status(400).json({
                  Error: "Nie posiadasz uprawnień, by móc dodać nowy temat!",
                });
              }
            } else {
              res.status(400).json({ Error: "Użytkownik nie istnieje!" });
            }
          }
        }
      );
    }
  }
);

module.exports = router;
