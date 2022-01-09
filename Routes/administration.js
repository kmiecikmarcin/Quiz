const express = require("express");
const { check, validationResult } = require("express-validator");
const verifyToken = require("../Functions/Others/verifyToken");
const administrationsControllers = require("../Controllers/administration");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Response = require("../Class/Response");

router.post(
  "/school-subject",
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
            administrationsControllers.createSchoolSubject(req, res, authData);
          }
        }
      );
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
            administrationsControllers.removeSchoolSubject(req, res, authData);
          }
        }
      );
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
            administrationsControllers.removeChapter(req, res, authData);
          }
        }
      );
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
            administrationsControllers.removeTopic(req, res, authData);
          }
        }
      );
    }
  }
);

router.get("/users-to-remove", (req, res) => {
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
          administrationsControllers.takeAllUsersToRemove(res, authData);
        }
      }
    );
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
            administrationsControllers.daleteUserAccount(req, res, authData);
          }
        }
      );
    }
  }
);

router.get("/users", (req, res) => {
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
          administrationsControllers.takeAllUsers(res, authData);
        }
      }
    );
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
            administrationsControllers.assignTeacherPermissions(
              req,
              res,
              authData
            );
          }
        }
      );
    }
  }
);

router.get("/chapters-to-remove", (req, res) => {
  const headerValidationResults = verifyToken(req);

  if (headerValidationResults === false) {
    res
      .status(400)
      .send(Response.returnError("Błędna wartość uwierzytelniania!"));
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
          administrationsControllers.takeAllChaptersWhichAreToRemove(
            res,
            authData
          );
        }
      }
    );
  }
});

router.get("/topics-to-remove", (req, res) => {
  const headerValidationResults = verifyToken(req);

  if (headerValidationResults === false) {
    res
      .status(400)
      .send(Response.returnError("Błędna wartość uwierzytelniania!"));
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
          administrationsControllers.takeAllTopicsWhichAreToRemove(
            res,
            authData
          );
        }
      }
    );
  }
});

module.exports = router;
