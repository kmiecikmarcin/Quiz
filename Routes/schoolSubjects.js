const express = require("express");
const { check, validationResult } = require("express-validator");
const verifyToken = require("../Functions/Others/verifyToken");
const schoolSubjectsControllers = require("../Controllers/schoolSubjects");

const router = express.Router();

router.get("/subjects", (req, res) => {
  const response = {
    messages: {
      message: [],
      error: [],
    },
  };

  const headerValidationResults = verifyToken(req);

  if (headerValidationResults === false) {
    response.messages.error.push(
      "Nie udało się przeprowadzić procesu uwierzytelniania!"
    );
    res.status(403).send(response);
  } else {
    schoolSubjectsControllers.takesAllSubjects(req, res);
  }
});

router.get("/chapters", (req, res) => {
  const response = {
    messages: {
      message: [],
      error: [],
    },
  };

  const headerValidationResults = verifyToken(req);

  if (headerValidationResults === false) {
    response.messages.error.push(
      "Nie udało się przeprowadzić procesu uwierzytelniania!"
    );
    res.status(403).send(response);
  } else {
    schoolSubjectsControllers.takesAllChapters(req, res);
  }
});

router.get("/topics", (req, res) => {
  const response = {
    messages: {
      message: [],
      error: [],
    },
  };

  const headerValidationResults = verifyToken(req);

  if (headerValidationResults === false) {
    response.messages.error.push(
      "Nie udało się przeprowadzić procesu uwierzytelniania!"
    );
    res.status(403).send(response);
  } else {
    schoolSubjectsControllers.takesAllTopics(req, res);
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
    const response = {
      messages: {
        message: [],
        error: [],
      },
    };

    const error = validationResult(req);
    const validationHeaderResults = verifyToken(req);

    if (!error.isEmpty()) {
      response.validationErrors = error
        .array({ onlyFirstError: true })
        .map((err) => ({ [err.param]: err.msg }));
      res.status(400).json(response);
    } else if (validationHeaderResults === false) {
      response.messages.error.push(
        "Nie udało się przeprowadzić procesu uwierzytelniania!"
      );
      res.status(403).send(response);
    } else {
      schoolSubjectsControllers.createsNewChapter(req, res);
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
    const response = {
      messages: {
        message: [],
        error: [],
      },
    };

    const error = validationResult(req);
    const validationHeaderResults = verifyToken(req);

    if (!error.isEmpty()) {
      response.validationErrors = error
        .array({ onlyFirstError: true })
        .map((err) => ({ [err.param]: err.msg }));
      res.status(400).json(response);
    } else if (validationHeaderResults === false) {
      response.messages.error.push(
        "Nie udało się przeprowadzić procesu uwierzytelniania!"
      );
      res.status(403).send(response);
    } else {
      schoolSubjectsControllers.createsNewTopic(req, res);
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
    const response = {
      messages: {
        message: [],
        error: [],
      },
    };

    const error = validationResult(req);
    const validationHeaderResults = verifyToken(req);

    if (!error.isEmpty()) {
      response.validationErrors = error
        .array({ onlyFirstError: true })
        .map((err) => ({ [err.param]: err.msg }));
      res.status(400).json(response);
    } else if (validationHeaderResults === false) {
      response.messages.error.push(
        "Nie udało się przeprowadzić procesu uwierzytelniania!"
      );
      res.status(403).send(response);
    } else {
      schoolSubjectsControllers.removeChapter(req, res);
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
    const response = {
      messages: {
        message: [],
        error: [],
      },
    };

    const error = validationResult(req);
    const validationHeaderResults = verifyToken(req);

    if (!error.isEmpty()) {
      response.validationErrors = error
        .array({ onlyFirstError: true })
        .map((err) => ({ [err.param]: err.msg }));
      res.status(400).json(response);
    } else if (validationHeaderResults === false) {
      response.messages.error.push(
        "Nie udało się przeprowadzić procesu uwierzytelniania!"
      );
      res.status(403).send(response);
    } else {
      schoolSubjectsControllers.removeTopic(req, res);
    }
  }
);

module.exports = router;
