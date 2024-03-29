const express = require("express");
const { check, validationResult } = require("express-validator");
const verifyToken = require("../Functions/Others/verifyToken");
const jwt = require("jsonwebtoken");
const schoolSubjectsControllers = require("../Controllers/schoolSubjects");
const Response = require("../Class/Response");

const router = express.Router();

router.get("/subjects", (req, res) => {
  const headerValidationResults = verifyToken(req);

  if (headerValidationResults === false) {
    res
      .status(403)
      .send(
        Response.returnError(
          "Nie udało się przeprowadzić procesu uwierzytelniania!"
        )
      );
  } else {
    jwt.verify(
      req.token,
      process.env.S3_SECRETKEY,
      async (jwtError, authData) => {
        if (jwtError) {
          return res
            .status(403)
            .json(Response.returnError("Błąd uwierzytelniania!"));
        } else {
          schoolSubjectsControllers.takesAllSubjects(res, authData);
        }
      }
    );
  }
});

router.get("/chapters", (req, res) => {
  const headerValidationResults = verifyToken(req);

  if (headerValidationResults === false) {
    res
      .status(403)
      .send(
        Response.returnError(
          "Nie udało się przeprowadzić procesu uwierzytelniania!"
        )
      );
  } else {
    jwt.verify(
      req.token,
      process.env.S3_SECRETKEY,
      async (jwtError, authData) => {
        if (jwtError) {
          return res
            .status(403)
            .json(Response.returnError("Błąd uwierzytelniania!"));
        } else {
          schoolSubjectsControllers.takesAllChapters(res, authData);
        }
      }
    );
  }
});

router.get("/topics", (req, res) => {
  const headerValidationResults = verifyToken(req);

  if (headerValidationResults === false) {
    res
      .status(403)
      .send(
        Response.returnError(
          "Nie udało się przeprowadzić procesu uwierzytelniania!"
        )
      );
  } else {
    jwt.verify(
      req.token,
      process.env.S3_SECRETKEY,
      async (jwtError, authData) => {
        if (jwtError) {
          return res
            .status(403)
            .json(Response.returnError("Błąd uwierzytelniania!"));
        } else {
          schoolSubjectsControllers.takesAllTopics(res, authData);
        }
      }
    );
  }
});

router.post(
  "/chapter",
  [
    check("nameOfSubject")
      .exists()
      .withMessage("Brak wymaganych danych!")
      .isLength({ min: 3 })
      .withMessage("Wprowadzony nazwa jest za krótka!")
      .isLength({ max: 64 })
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
    check("nameOfChapter")
      .exists()
      .withMessage("Brak wymaganych danych!")
      .isLength({ min: 3 })
      .withMessage("Wprowadzony nazwa jest za krótka!")
      .isLength({ max: 64 })
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
    const error = validationResult(req);
    const validationHeaderResults = verifyToken(req);

    if (!error.isEmpty()) {
      const response = error
        .array({ onlyFirstError: true })
        .map((err) => ({ [err.param]: err.msg }));
      res.status(400).json(Response.returnValidationError(response));
    } else if (validationHeaderResults === false) {
      res
        .status(403)
        .send(
          Response.returnError(
            "Nie udało się przeprowadzić procesu uwierzytelniania!"
          )
        );
    } else {
      jwt.verify(
        req.token,
        process.env.S3_SECRETKEY,
        async (jwtError, authData) => {
          if (jwtError) {
            return res
              .status(403)
              .json(Response.returnError("Błąd uwierzytelniania!"));
          } else {
            schoolSubjectsControllers.createsNewChapter(req, res, authData);
          }
        }
      );
    }
  }
);

router.post(
  "/topic",
  [
    check("nameOfChapter")
      .exists()
      .withMessage("Brak wymaganych danych!")
      .isLength({ min: 3 })
      .withMessage("Wprowadzony nazwa jest za krótka!")
      .isLength({ max: 64 })
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
    check("nameOfTopic")
      .exists()
      .withMessage("Brak wymaganych danych!")
      .isLength({ min: 3 })
      .withMessage("Wprowadzony nazwa jest za krótka!")
      .isLength({ max: 64 })
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
    const error = validationResult(req);
    const validationHeaderResults = verifyToken(req);

    if (!error.isEmpty()) {
      const response = error
        .array({ onlyFirstError: true })
        .map((err) => ({ [err.param]: err.msg }));
      res.status(400).json(Response.returnValidationError(response));
    } else if (validationHeaderResults === false) {
      res
        .status(403)
        .send(
          Response.returnError(
            "Nie udało się przeprowadzić procesu uwierzytelniania!"
          )
        );
    } else {
      jwt.verify(
        req.token,
        process.env.S3_SECRETKEY,
        async (jwtError, authData) => {
          if (jwtError) {
            return res
              .status(403)
              .json(Response.returnError("Błąd uwierzytelniania!"));
          } else {
            schoolSubjectsControllers.createsNewTopic(req, res, authData);
          }
        }
      );
    }
  }
);

router.patch(
  "/remove-chapter",
  [
    check("nameOfChapter")
      .exists()
      .withMessage("Brak wymaganych danych!")
      .isLength({ min: 3 })
      .withMessage("Wprowadzony nazwa jest za krótka!")
      .isLength({ max: 64 })
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
    const error = validationResult(req);
    const validationHeaderResults = verifyToken(req);

    if (!error.isEmpty()) {
      const response = error
        .array({ onlyFirstError: true })
        .map((err) => ({ [err.param]: err.msg }));
      res.status(400).json(Response.returnValidationError(response));
    } else if (validationHeaderResults === false) {
      res
        .status(403)
        .send(
          Response.returnError(
            "Nie udało się przeprowadzić procesu uwierzytelniania!"
          )
        );
    } else {
      jwt.verify(
        req.token,
        process.env.S3_SECRETKEY,
        async (jwtError, authData) => {
          if (jwtError) {
            return res
              .status(403)
              .json(Response.returnError("Błąd uwierzytelniania!"));
          } else {
            schoolSubjectsControllers.removeChapter(req, res, authData);
          }
        }
      );
    }
  }
);

router.patch(
  "/remove-topic",
  [
    check("nameOfTopic")
      .exists()
      .withMessage("Brak wymaganych danych!")
      .isLength({ min: 3 })
      .withMessage("Wprowadzony nazwa jest za krótka!")
      .isLength({ max: 64 })
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
    const error = validationResult(req);
    const validationHeaderResults = verifyToken(req);

    if (!error.isEmpty()) {
      const response = error
        .array({ onlyFirstError: true })
        .map((err) => ({ [err.param]: err.msg }));
      res.status(400).json(Response.returnValidationError(response));
    } else if (validationHeaderResults === false) {
      res
        .status(403)
        .send(
          Response.returnError(
            "Nie udało się przeprowadzić procesu uwierzytelniania!"
          )
        );
    } else {
      jwt.verify(
        req.token,
        process.env.S3_SECRETKEY,
        async (jwtError, authData) => {
          if (jwtError) {
            return res
              .status(403)
              .json(Response.returnError("Błąd uwierzytelniania!"));
          } else {
            schoolSubjectsControllers.removeTopic(req, res, authData);
          }
        }
      );
    }
  }
);

module.exports = router;
