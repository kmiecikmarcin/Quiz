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
  verifyToken,
  (req, res) => {
    const error = validationResult(req);
    const response = {
      validationErrors: [],
    };

    if (!error.isEmpty()) {
      response.validationErrors = error
        .array({ onlyFirstError: true })
        .map((err) => ({ [err.param]: err.msg }));
      res.status(400).json(response);
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
      administrationsControllers.removeTopic(req, res);
    }
  }
);

router.get("/usersToRemove", verifyToken, (req, res) => {
  administrationsControllers.takeAllUsersToRemove(req, res);
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
      administrationsControllers.daleteUserAccount(req, res);
    }
  }
);

router.get("/users", verifyToken, (req, res) => {
  administrationsControllers.takeAllUsers(req, res);
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
      administrationsControllers.assignTeacherPermissions(req, res);
    }
  }
);

module.exports = router;
