const express = require("express");
const jwt = require("jsonwebtoken");
const verifyToken = require("../Functions/Others/verifyToken");
const checkExistsOfUserEmail = require("../Functions/Users/checkExistsOfUserEmail");
const Model = require("../Functions/Others/takeModels");
const takeAllSchoolSubjects = require("../Functions/SchoolSubjects/takeAllSchoolSubjects");
const takeAllChapters = require("../Functions/SchoolSubjects/takeAllChapters");

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
          const takeSchoolSubjects = await takeAllSchoolSubjects(
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
          const takeChapters = await takeAllChapters(Model.Chapters);
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

module.exports = router;
