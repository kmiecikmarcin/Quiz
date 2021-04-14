const express = require("express");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const verifyToken = require("../Functions/Others/verifyToken");
const checkTheSchoolSubjectExists = require("../Functions/SchoolSubjects/checkTheSchoolSubjectExists");
const Model = require("../Functions/Others/takeModels");
const createNewSchoolSubject = require("../Functions/SchoolSubjects/createNewSchoolSubject");
const checkExistsOfUserEmail = require("../Functions/Users/checkExistsOfUserEmail");

const router = express.Router();

/**
 * @swagger
 *  /administration/schoolSubjects:
 *    post:
 *      tags:
 *      - name: Administration
 *      summary: Create new school subject
 *      parameters:
 *        - in: body
 *          name: School subject
 *          description: The user can create new school subject.
 *          schema:
 *            type: object
 *            required: true
 *            properties:
 *              new_name_of_school_subject:
 *                type: string
 *                example: Etyka
 *      responses:
 *        201:
 *          description: Added new school subject!
 *        400:
 *          description: Error about entered data.
 *        403:
 *          description: Forbidden.
 */
router.post(
  "/schoolSubjects",
  [
    check("new_name_of_school_subject")
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
              if (authData.name === process.env.S3_ADMIN_PERMISSIONS) {
                const checkSchoolSubjectExist = await checkTheSchoolSubjectExists(
                  Model.SchoolSubjects,
                  req.body.new_name_of_school_subject
                );
                if (checkSchoolSubjectExist === false) {
                  const newSchoolSubject = await createNewSchoolSubject(
                    Model.SchoolSubjects,
                    req.body.new_name_of_school_subject
                  );
                  if (newSchoolSubject !== false) {
                    res.status(201).json({
                      Message: "Pomyślnie dodano nowy przedmiot szkolny!",
                    });
                  } else {
                    res.status(400).json({
                      Error:
                        "Nie udało się utworzyć nowego przedmiotu szkolnego!",
                    });
                  }
                } else {
                  res
                    .status(400)
                    .json({ Error: "Przedmiot szkolny już istnieje!" });
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

module.exports = router;