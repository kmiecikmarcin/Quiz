const express = require("express");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const verifyToken = require("../Functions/Others/verifyToken");
const checkExistsOfUserEmail = require("../Functions/Users/checkExistsOfUserEmail");
const Model = require("../Functions/Others/takeModels");
const takeDataAboutSchoolSubjects = require("../Functions/SchoolSubjects/takeDataAboutSchoolSubjects");
const checkTheChapterIsUnique = require("../Functions/SchoolSubjects/checkTheChapterIsUnique");
const checkTheSubjectExists = require("../Functions/SchoolSubjects/checkTheSubjectExists");
const createNewChapter = require("../Functions/SchoolSubjects/createNewChapter");

const router = express.Router();

/**
 * @swagger
 *  /schoolSubjects/subjects:
 *    get:
 *      tags:
 *      - name: School subjects
 *      summary: You can take all subjects
 *      responses:
 *        201:
 *          description: List of school subjects.
 *        400:
 *          description: Error about entered data.
 *        403:
 *          description: Forbidden.
 *        501:
 *          description: System error - subjects doesn't exist!
 */
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

/**
 * @swagger
 *  /schoolSubjects/chapters:
 *    get:
 *      tags:
 *      - name: School subjects
 *      summary: You can take all chapters
 *      responses:
 *        201:
 *          description: List of chapters.
 *        400:
 *          description: Error about entered data.
 *        403:
 *          description: Forbidden.
 *        404:
 *          description: Not Found.
 */
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
          const takeChapters = await takeDataAboutSchoolSubjects(
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

/**
 * @swagger
 *  /schoolSubjects/topics:
 *    get:
 *      tags:
 *      - name: School subjects
 *      summary: You can take all topics
 *      responses:
 *        201:
 *          description: List of topics.
 *        400:
 *          description: Error about entered data.
 *        403:
 *          description: Forbidden.
 *        404:
 *          description: Not Found.
 */
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
          const takeTopics = await takeDataAboutSchoolSubjects(Model.Topics);
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

/**
 * @swagger
 *  /schoolSubjects/chapters:
 *    post:
 *      tags:
 *      - name: School subjects
 *      summary: Create new chapter
 *      parameters:
 *        - in: body
 *          name: Chapter
 *          description: The user can create new chapter.
 *          schema:
 *            type: object
 *            required: true
 *            properties:
 *              name_of_subject:
 *                type: string
 *                example: Geografia
 *              name_of_chapter:
 *                type: string
 *                example: Lądy
 *      responses:
 *        201:
 *          description: Added new chapter!
 *        400:
 *          description: Error about entered data.
 *        403:
 *          description: Forbidden.
 */
router.post(
  "/chapters",
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
  "/topics",
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
  () => {}
);

module.exports = router;
