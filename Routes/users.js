const express = require("express");
const { check, validationResult } = require("express-validator");
const userControllers = require("../Controllers/users");
const jwt = require("jsonwebtoken");
const checkPasswordAboutOneSpecialKey = require("../Functions/Others/checkPasswordAboutOneSpecialKey");
const checkEnteredGender = require("../Functions/Others/checkEnteredGender");
const checkUserVerification = require("../Functions/Others/checkUserVerification");
const verifyToken = require("../Functions/Others/verifyToken");
const Response = require("../Class/Response");

const router = express.Router();

router.post(
  "/register",
  [
    check("userEmail")
      .exists()
      .withMessage("Brak wymaganych danych!")
      .isLength({ max: 254 })
      .withMessage("Wprowadzony adres e-mail jest za długi!")
      .isEmail()
      .withMessage("Adres e-mail został wprowadzony niepoprawnie!"),

    check("userPassword")
      .exists()
      .withMessage("Brak wymaganych danych!")
      .isLength({ min: 6 })
      .withMessage("Hasło jest za krótkie!")
      .isLength({ max: 32 })
      .withMessage("Hasło jest za długie!")
      .custom((value) => {
        if (checkPasswordAboutOneSpecialKey(value) === false) {
          throw new Error(
            "Hasło nie zawiera minimum jednego znaku specjalnego!"
          );
        } else {
          return value;
        }
      })
      .custom((value) => {
        // eslint-disable-next-line no-useless-escape
        const badSpecialKeys = /[\,\+\=\.\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-]/.test(
          value
        );
        if (badSpecialKeys === true) {
          throw new Error("Hasło zawiera nieprawidłowy znak!");
        } else {
          return value;
        }
      }),

    check("confirmPassword")
      .exists()
      .withMessage("Brak wymaganych danych!")
      .custom((value, { req }) => {
        if (value !== req.body.userPassword) {
          throw new Error("Hasła są różne!");
        } else if (value.length == 0) {
          throw new Error("Wartość jest pusta!");
        } else {
          return value;
        }
      }),

    check("userGender")
      .exists()
      .withMessage("Brak wymaganych danych!")
      .isLength({ min: 1 })
      .withMessage("Wprowadzone dane są za krótkie!")
      .isLength({ max: 20 })
      .withMessage("Wprowadzone dane sa za długie!")
      .custom((value) => {
        if (checkEnteredGender(value) === false) {
          throw new Error("Podano błędną wartość!");
        } else {
          return value;
        }
      }),

    check("userVerification")
      .exists()
      .withMessage("Brak wymaganych danych!")
      .isBoolean()
      .withMessage("Wprowadzona wartość jest nieprawidłowa!")
      .custom((value) => {
        const verification = checkUserVerification(value);
        if (verification === false) {
          throw new Error("Brak weryfikacji użytkownika!");
        } else {
          return value;
        }
      }),
  ],
  (req, res) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
      const response = error
        .array({ onlyFirstError: true })
        .map((err) => ({ [err.param]: err.msg }));
      res.status(400).json(Response.returnValidationError(response));
    } else {
      userControllers.registration(req, res);
    }
  }
);

router.post(
  "/login",
  [
    check("userEmail")
      .exists()
      .withMessage("Brak wymaganych danych!")
      .isLength({ max: 254 })
      .withMessage("Wprowadzony adres e-mail jest za długi!")
      .isEmail()
      .withMessage("Adres e-mail został wprowadzony niepoprawnie!"),

    check("userPassword")
      .exists()
      .withMessage("Brak wymaganych danych!")
      .isLength({ min: 6 })
      .withMessage("Hasło jest za krótkie!")
      .isLength({ max: 32 })
      .withMessage("Hasło jest za długie!"),
  ],
  (req, res) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
      const response = error
        .array({ onlyFirstError: true })
        .map((err) => ({ [err.param]: err.msg }));
      res.status(400).json(Response.returnValidationError(response));
    } else {
      userControllers.login(req, res);
    }
  }
);

router.patch(
  "/email",
  [
    check("newUserEmail")
      .exists()
      .withMessage("Brak wymaganych danych!")
      .isLength({ max: 254 })
      .withMessage("Wprowadzony adres e-mail jest za długi!")
      .isEmail()
      .withMessage("Adres e-mail został wprowadzony niepoprawnie!"),

    check("userPassword")
      .exists()
      .withMessage("Brak wymaganych danych!")
      .isLength({ min: 6 })
      .withMessage("Hasło jest za krótkie!")
      .isLength({ max: 32 })
      .withMessage("Hasło jest za długie!"),
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
            userControllers.email(req, res, authData);
          }
        }
      );
    }
  }
);

router.patch(
  "/password",
  [
    check("newUserPassword")
      .exists()
      .withMessage("Brak wymaganych danych!")
      .isLength({ min: 6 })
      .withMessage("Hasło jest za krótkie!")
      .isLength({ max: 32 })
      .withMessage("Hasło jest za długie!")
      .custom((value) => {
        if (checkPasswordAboutOneSpecialKey(value) === false) {
          throw new Error(
            "Hasło nie zawiera minimum jednego znaku specjalnego!"
          );
        } else {
          return value;
        }
      })
      .custom((value) => {
        // eslint-disable-next-line no-useless-escape
        const badSpecialKeys = /[\,\+\=\.\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-]/.test(
          value
        );
        if (badSpecialKeys === true) {
          throw new Error("Hasło zawiera nieprawidłowy znak!");
        } else {
          return value;
        }
      }),
    check("confirmNewUserPassword")
      .exists()
      .withMessage("Brak wymaganych danych!")
      .custom((value, { req }) => {
        if (value !== req.body.newUserPassword) {
          throw new Error("Hasła są różne!");
        }
        if (value.length == 0) {
          throw new Error("Wartość jest pusta!");
        } else {
          return value;
        }
      }),
    check("userPassword")
      .exists()
      .withMessage("Brak wymaganych danych!")
      .isLength({ min: 6 })
      .withMessage("Hasło jest za krótkie!")
      .isLength({ max: 32 })
      .withMessage("Hasło jest za długie!"),
  ],
  (req, res) => {
    const response = {
      messages: {},
      validationErrors: [],
    };

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
            userControllers.password(req, res, authData);
          }
        }
      );
    }
  }
);

router.patch(
  "/delete",
  [
    check("userPassword")
      .exists()
      .withMessage("Brak wymaganych danych!")
      .isLength({ min: 6 })
      .withMessage("Hasło jest za krótkie!")
      .isLength({ max: 32 })
      .withMessage("Hasło jest za długie!"),

    check("confirmPassword")
      .exists()
      .withMessage("Brak wymaganych danych!")
      .custom((value, { req }) => {
        if (value !== req.body.userPassword) {
          throw new Error("Hasła sa różne!");
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
            userControllers.accountToDelete(req, res, authData);
          }
        }
      );
    }
  }
);

module.exports = router;
