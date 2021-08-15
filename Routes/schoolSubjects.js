const express = require("express");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const verifyToken = require("../Functions/Others/verifyToken");
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
  const response = {
    messages: {},
    schoolSubjects: [],
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
          const takeSchoolSubjects = await takeDataAboutSchoolSubjects(
            Model.SchoolSubjects
          );
          if (takeSchoolSubjects !== false) {
            response.schoolSubjects = takeSchoolSubjects;
            res.status(200).json(response);
          } else {
            response.messages = { error: "Brak przedmiotów szkolnych!" };
            res.status(501).json(response);
          }
        } else {
          response.messages = { error: "Użytkownik nie istnieje!" };
          res.status(400).json(response);
        }
      }
    }
  );
});

router.get("/chapters", verifyToken, (req, res) => {
  const response = {
    messages: {},
    chapters: [],
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
          const takeChapters = await takeDataAboutChaptersAndTopics(
            Model.Chapters
          );
          if (takeChapters !== false) {
            response.chapters = takeChapters;
            res.status(200).json(response);
          } else {
            response.messages = { error: "Brak rozdziałów w systemie!" };
            res.status(404).json(response);
          }
        } else {
          response.messages = { error: "Użytkownik nie istnieje!" };
          res.status(400).json(response);
        }
      }
    }
  );
});

router.get("/topics", verifyToken, (req, res) => {
  const response = {
    messages: {},
    topics: [],
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
          const takeTopics = await takeDataAboutChaptersAndTopics(Model.Topics);
          if (takeTopics !== false) {
            response.topics = takeTopics;
            res.status(200).json(response);
          } else {
            response.messages = { error: "Brak tematów w systemie!" };
            res.status(404).json(response);
          }
        } else {
          response.messages = { error: "Użytkownik nie istnieje!" };
          res.status(400).json(response);
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
        const badSpecialKeys =
          /[\,\+\=\.\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-\@\#\!\$\%\^\&\*]/.test(
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
        const badSpecialKeys =
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
              if (
                authData.name === process.env.S3_TEACHER_PERMISSIONS ||
                authData.name === process.env.S3_ADMIN_PERMISSIONS
              ) {
                const resposneAboutSubjectExists = await checkTheSubjectExists(
                  Model.SchoolSubjects,
                  req.body.name_of_subject
                );
                if (resposneAboutSubjectExists !== false) {
                  const responseAboutUniquenessOfChapter =
                    await checkTheChapterIsUnique(
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
                      response.messages = {
                        message: "Pomyślnie dodano nowy rozdział!",
                      };
                      res.status(201).json(response);
                    } else {
                      response.messages = {
                        error:
                          "Nie udało się dodać nowego rodziału! Sprawdź wprowadzone dane.",
                      };

                      res.status(400).json(response);
                    }
                  } else {
                    response.messages = {
                      error: "Rozdział o wprowadzonej nazwie już istnieje!",
                    };
                    res.status(400).json(response);
                  }
                } else {
                  response.messages = {
                    error: "Wybrany przedmiot szkolny nie istnieje!",
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
        const badSpecialKeys =
          /[\,\+\=\.\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-\@\#\!\$\%\^\&\*]/.test(
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
        const badSpecialKeys =
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
              if (
                authData.name === process.env.S3_TEACHER_PERMISSIONS ||
                authData.name === process.env.S3_ADMIN_PERMISSIONS
              ) {
                const resposneAboutChapterExists = await checkTheChapterExists(
                  Model.Chapters,
                  req.body.name_of_chapter
                );
                if (resposneAboutChapterExists !== false) {
                  const responseAboutUniquenessOfTopic =
                    await checkTheTopicIsUnique(
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
                      response.messages = {
                        message: "Pomyślnie dodano nowy temat!",
                      };
                      res.status(201).json(response);
                    } else {
                      response.messages = {
                        error:
                          "Nie udało się dodać nowego tematu! Sprawdź wprowadzone dane.",
                      };
                      res.status(400).json(response);
                    }
                  } else {
                    response.messages = {
                      error: "Temat o wprowadzonej nazwie już istnieje!",
                    };
                    res.status(400).json(response);
                  }
                } else {
                  response.messages = {
                    error: "Wybrany rozdział nie istnieje!",
                  };
                  res.status(400).json(response);
                }
              } else {
                response.messages = {
                  error: "Nie posiadasz uprawnień, by móc dodać nowy temat!",
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

router.put(
  "/remove-chapter",
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
        const badSpecialKeys =
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
                      response.messages = {
                        message: "Pomyślnie usunięto rozdział!",
                      };
                      res.status(200).json(response);
                    } else {
                      response.messages = {
                        error: "Nie udało się usunąć wybranego rozdziału!",
                      };

                      res.status(400).json(response);
                    }
                  } else {
                    response.messages = {
                      error: "Rozdział posiada przypisane do siebie tematy",
                    };

                    res.status(400).json(response);
                  }
                } else {
                  response.messages = {
                    error: "Wybrany rozdział nie istnieje!",
                  };
                  res.status(404).json(response);
                }
              } else {
                response.messages = {
                  error: "Nie posiadasz uprawnień, by móc dodać nowy temat!",
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

router.put(
  "/remove-topic",
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
        const badSpecialKeys =
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
                    response.messages = {
                      message: "Pomyślnie usunięto temat!",
                    };
                    res.status(200).json(response);
                  } else {
                    response.messages = {
                      error: "Nie udało się usunąć wybranego tematu!",
                    };
                    res.status(400).json(response);
                  }
                } else {
                  response.messages = { error: "Wybrany temat nie istnieje!" };
                  res.status(404).json(response);
                }
              } else {
                response.messages = {
                  error: "Nie posiadasz uprawnień, by móc dodać nowy temat!",
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
