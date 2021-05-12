const express = require("express");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const Model = require("../Functions/Others/takeModels");
const checkPasswordAboutOneSpecialKey = require("../Functions/Others/checkPasswordAboutOneSpecialKey");
const checkEnteredGender = require("../Functions/Others/checkEnteredGender");
const checkUserVerification = require("../Functions/Others/checkUserVerification");
const checkEmailIsUnique = require("../Functions/Users/checkEmailIsUnique");
const checkGenderIsCorrectAndFindIt = require("../Functions/Users/checkGenderIsCorrectAndFindIt");
const createNewUserCommonAccount = require("../Functions/Users/createNewUserCommonAccount");
const findBasicUserRole = require("../Functions/Users/findBasicUserRole");
const checkExistsOfUserEmail = require("../Functions/Users/checkExistsOfUserEmail");
const findUserRoleById = require("../Functions/Users/findUserRoleById");
const userTryToLogin = require("../Functions/Users/userTryToLogin");
const takeDataAboutUser = require("../Functions/Users/takeDataAboutUser");
const verifyToken = require("../Functions/Others/verifyToken");
const userDeleteHisAccount = require("../Functions/Users/userDeleteHisAccount");
const changeUserEmailAdress = require("../Functions/Users/changeUserEmailAdress");
const changeUserPassword = require("../Functions/Users/changeUserPassword");

const router = express.Router();

router.post(
  "/register",
  [
    check("user_email")
      .exists()
      .withMessage("Brak wymaganych danych!")
      .isLength({ max: 254 })
      .withMessage("Wprowadzony adres e-mail jest za długi!")
      .isEmail()
      .withMessage("Adres e-mail został wprowadzony niepoprawnie!"),

    check("user_password")
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

    check("confirm_password")
      .exists()
      .withMessage("Brak wymaganych danych!")
      .custom((value, { req }) => {
        if (value !== req.body.user_password) {
          throw new Error("Hasła sa różne!");
        } else {
          return value;
        }
      }),

    check("user_gender")
      .exists()
      .withMessage("Brak wymaganych danych!")
      .isLength({ min: 1 })
      .withMessage("Wprowadzone dane są za krótkie!")
      .isLength({ max: 20 })
      .isMessage("Wprowadzone dane sa za długie!")
      .custom((value) => {
        if (checkEnteredGender(value) === false) {
          throw new Error("Podano błędną wartość!");
        } else {
          return value;
        }
      }),

    check("user_verification")
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
  async (req, res) => {
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
      const checkEnteredEmail = await checkEmailIsUnique(
        Model.Users,
        req.body.user_email
      );
      if (checkEnteredEmail === true) {
        const checkEnteredGender = await checkGenderIsCorrectAndFindIt(
          Model.Genders,
          req.body.user_gender
        );
        if (checkEnteredGender !== null) {
          const findRoleForUser = await findBasicUserRole(
            Model.TypesOfUsersRoles
          );
          if (findRoleForUser !== false) {
            const createAccount = await createNewUserCommonAccount(
              Model.Users,
              req.body.user_email,
              req.body.user_password,
              findRoleForUser,
              checkEnteredGender
            );
            if (createAccount === true) {
              response.messages = {
                message: "Rejestracja przebiegła pomyślnie!",
              };
              res.status(201).json(response);
            } else {
              response.messages = { error: "Rejestracja nie powiodła się!" };
              res.status(400).json(response);
            }
          } else {
            response.messages = {
              error: "Błąd systemu! Brak roli dla użytkownika!",
            };
            res.status(501).json(response);
          }
        } else {
          response.messages = {
            error: "Wprowadzona płeć nie istnieje w systemie!",
          };
          res.status(400).json(response);
        }
      } else {
        response.messages = {
          error: "Wprowadzony adres e-mail istnieje w systemie!",
        };
        res.status(400).json(response);
      }
    }
  }
);

router.post(
  "/login",
  [
    check("user_email")
      .exists()
      .withMessage("Brak wymaganych danych!")
      .isLength({ min: 1 })
      .withMessage("Wprowadzony adres e-mail jest za krótki!")
      .isLength({ max: 254 })
      .withMessage("Wprowadzony adres e-mail jest za długi!")
      .isEmail()
      .withMessage("Adres e-mail został wprowadzony niepoprawnie!"),

    check("user_password")
      .exists()
      .withMessage("Brak wymaganych danych!")
      .isLength({ min: 6 })
      .withMessage("Hasło jest za krótkie!")
      .isLength({ max: 32 })
      .withMessage("Hasło jest za długie!"),
  ],
  async (req, res) => {
    const error = validationResult(req);
    const response = {
      messages: {},
      validationErrors: {},
    };

    if (!error.isEmpty()) {
      response.validationErrors = error
        .array({ onlyFirstError: true })
        .map((err) => ({ [err.param]: err.msg }));
      res.status(400).json(response);
    } else {
      const checkEneteredEmailAdress = await checkExistsOfUserEmail(
        Model.Users,
        req.body.user_email
      );
      if (checkEneteredEmailAdress !== false) {
        const checkTypeOfUserRole = await findUserRoleById(
          Model.TypesOfUsersRoles,
          checkEneteredEmailAdress.userRoleId
        );
        if (checkTypeOfUserRole !== false) {
          const userData = await takeDataAboutUser(
            Model.Users,
            checkEneteredEmailAdress.userId
          );
          if (userData !== false) {
            const generatedTokenForUser = await userTryToLogin(
              req.body.user_password,
              userData.id,
              userData.email,
              userData.password,
              checkTypeOfUserRole
            );
            if (generatedTokenForUser !== false) {
              response.messages = { token: generatedTokenForUser };
              res.status(200).json(response);
            } else {
              response.messages = { error: "Nie udało się zalogować!" };
              res.status(400).json(response);
            }
          } else {
            response.messages = {
              error: "Coś poszło nie tak. Sprawdź wprowadzone dane!",
            };
            res.status(404).json(response);
          }
        } else {
          response.messages = {
            error: "Nie odnaleziono uprawnień dla tego użytkownika!",
          };
          res.status(404).json(response);
        }
      } else {
        response.messages = {
          error: "Wprowadzony adress e-mail nie istnieje!",
        };
        res.status(400).json(response);
      }
    }
  }
);

router.put(
  "/email",
  [
    check("new_user_email")
      .exists()
      .withMessage("Brak wymaganych danych!")
      .isLength({ min: 1 })
      .withMessage("Wprowadzony adres e-mail jest za krótki!")
      .isLength({ max: 254 })
      .withMessage("Wprowadzony adres e-mail jest za długi!")
      .isEmail()
      .withMessage("Adres e-mail został wprowadzony niepoprawnie!"),

    check("user_password")
      .exists()
      .withMessage("Brak wymaganych danych!")
      .isLength({ min: 6 })
      .withMessage("Hasło jest za krótkie!")
      .isLength({ max: 32 })
      .withMessage("Hasło jest za długie!"),
  ],
  verifyToken,
  (req, res) => {
    const error = validationResult(req);
    const response = {
      messages: {},
      validationErrors: {},
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
              const takeUserData = await takeDataAboutUser(
                Model.Users,
                checkUser.userId
              );
              if (takeUserData !== false) {
                const updateUserEmail = await changeUserEmailAdress(
                  Model.Users,
                  takeUserData.id,
                  takeUserData.email,
                  takeUserData.password,
                  req.body.user_password,
                  req.body.new_user_email
                );
                if (updateUserEmail !== false) {
                  const newTokenForUser = await userTryToLogin(
                    req.body.user_password,
                    takeUserData.id,
                    req.body.new_user_email,
                    takeUserData.password,
                    checkUser.userRoleId
                  );
                  if (newTokenForUser !== false) {
                    response.messages = { token: newTokenForUser };
                    res.status(200).json(response);
                  } else {
                    response.messages = {
                      error:
                        "Nie udało się przeprowadzić operacji uwierzytelnienia!",
                    };
                    res.status(403).json(response);
                  }
                } else {
                  response.messages = {
                    error: "Coś poszło nie tak. Sprawdź wprowadzone dane!",
                  };
                  res.status(400).json(response);
                }
              } else {
                response.messages = {
                  error: "Nie odnaleziono danych dotyczących użytkownika!",
                };

                res.status(404).json(response);
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
  "/password",
  [
    check("new_user_password")
      .exists()
      .withMessage("Brak wymaganych danych!")
      .isLength({ min: 6 })
      .withMessage("Hasło jest za krótkie!")
      .isLength({ max: 32 })
      .withMessage("Hasło jest za długie!"),
    check("confirm_new_user_password")
      .exists()
      .withMessage("Brak wymaganych danych!")
      .custom((value, { req }) => {
        if (value !== req.body.new_user_password) {
          throw new Error("Hasła sa różne!");
        } else {
          return value;
        }
      }),
    check("user_password")
      .exists()
      .withMessage("Brak wymaganych danych!")
      .isLength({ min: 6 })
      .withMessage("Hasło jest za krótkie!")
      .isLength({ max: 32 })
      .withMessage("Hasło jest za długie!"),
  ],
  verifyToken,
  (req, res) => {
    const error = validationResult(req);
    const response = {
      messages: {},
      validationErrors: {},
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
              const takeUserData = await takeDataAboutUser(
                Model.Users,
                checkUser.userId
              );
              if (takeUserData !== false) {
                const updateUserPassword = await changeUserPassword(
                  Model.Users,
                  takeUserData.id,
                  takeUserData.email,
                  takeUserData.password,
                  req.body.user_password,
                  req.body.new_user_password
                );
                if (updateUserPassword !== false) {
                  const newTokenForUser = await userTryToLogin(
                    req.body.new_user_password,
                    takeUserData.id,
                    takeUserData.email,
                    updateUserPassword,
                    checkUser.userRoleId
                  );
                  if (newTokenForUser !== false) {
                    response.messages = { token: newTokenForUser };
                    res.status(200).json(response);
                  } else {
                    response.messages = {
                      error:
                        "Nie udało się przeprowadzić operacji uwierzytelnienia!",
                    };

                    res.status(403).json(response);
                  }
                } else {
                  response.messages = {
                    error:
                      "Wprowadzone aktualne hasło jest nieprawidłowe. Sprawdź wprowadzone dane!",
                  };
                  res.status(400).json(response);
                }
              } else {
                response.messages = {
                  error: "Nie odnaleziono danych dotyczących użytkownika!",
                };
                res.status(404).json(response);
              }
            } else {
              response.messages = {
                error: "Użytkownik nie istnieje!",
              };
              res.status(400).json(response);
            }
          }
        }
      );
    }
  }
);

router.put(
  "/delete",
  [
    check("user_password")
      .exists()
      .withMessage("Brak wymaganych danych!")
      .isLength({ min: 6 })
      .withMessage("Hasło jest za krótkie!")
      .isLength({ max: 32 })
      .withMessage("Hasło jest za długie!"),

    check("confirm_password")
      .exists()
      .withMessage("Brak wymaganych danych!")
      .custom((value, { req }) => {
        if (value !== req.body.user_password) {
          throw new Error("Hasła sa różne!");
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
      validationErrors: {},
    };

    if (!error.isEmpty()) {
      response.Error = error
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
              const takeUserData = await takeDataAboutUser(
                Model.Users,
                checkUser.userId
              );
              if (takeUserData !== false) {
                const deleteAccount = await userDeleteHisAccount(
                  Model.Users,
                  req.body.user_password,
                  takeUserData.id,
                  takeUserData.password
                );
                if (deleteAccount !== false) {
                  response.messages = { message: "Pomyślnie usunięto konto!" };
                  res.status(200).json(response);
                } else {
                  response.messages = {
                    error: "Coś poszło nie tak. Sprawdź wprowadzone dane!",
                  };
                  res.status(400).json(response);
                }
              } else {
                response.messages = {
                  error: "Nie odnaleziono danych dotyczących użytkownika!",
                };
                res.status(404).json(response);
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
