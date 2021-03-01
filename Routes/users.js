const express = require("express");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const Model = require("../Functions/Others/takeAndReturnModelInstance");
const checkPasswordAboutOneSpecialKey = require("../Functions/Others/checkPasswordAboutOneSpecialKey");
const checkEnteredGender = require("../Functions/Others/checkEnteredGender");
const checkUserVerification = require("../Functions/Others/checkUserVerification");
const checkEmailIsUnique = require("../Functions/Users/checkEmailIsUnique");
const checkGenderIsCorrectAndFindIt = require("../Functions/Users/checkGenderIsCorrectAndFindIt");
const createNewUserCommonAccount = require("../Functions/Users/createNewUserCommonAccount");
const findBasicUserRole = require("../Functions/Users/findBasicUserRole");
const checkIfUserEmailExists = require("../Functions/Users/checkIfUserEmailExists");
const findUserRoleById = require("../Functions/Users/findUserRoleById");
const userTryToLogin = require("../Functions/Users/userTryToLogin");
const takeDataAboutUser = require("../Functions/Users/takeDataAboutUser");
const verifyToken = require("../Functions/Others/verifyToken");
const userDeleteHisAccount = require("../Functions/Users/userDeleteHisAccount");

const router = express.Router();

/**
 * @swagger
 * /users/register:
 *    post:
 *      tags:
 *      - name: Users
 *      summary: Registration in system
 *      parameters:
 *        - in: body
 *          name: Register
 *          description: The user registration with data wchich his entered.
 *          schema:
 *            type: object
 *            required: true
 *            properties:
 *              user_email:
 *                type: string
 *                example: exampleEmailAdress@gmail.com
 *              user_password:
 *                type: string
 *                example: password@
 *              confirm_password:
 *                type: string
 *                example: password@
 *              user_gender:
 *                type: string
 *                example: Kobieta
 *              user_verification:
 *                type: boolean
 *                example: false
 *      responses:
 *        201:
 *          description: Successfully registered!
 *        400:
 *          description: Error about entered data.
 *        502:
 *          description: System error - user role doesn't exist!
 */
router.post(
  "/register",
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
      .isLength({ min: 1, max: 20 })
      .withMessage("Nie wprowadzono danych!")
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

    if (!error.isEmpty()) {
      res.status(400).json(error.mapped());
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
              res
                .status(201)
                .json({ Message: "Rejestracja przebiegła pomyślnie!" });
            } else {
              res.status(400).json({ Error: "Rejestracja nie powiodła się!" });
            }
          } else {
            res
              .status(502)
              .json({ Error: "Błąd systemu! Brak roli dla użytkownika!" });
          }
        } else {
          res
            .status(400)
            .json({ Error: "Wprowadzona płeć nie istnieje w systemie!" });
        }
      } else {
        res
          .status(400)
          .json({ Error: "Wprowadzony adres e-mail istnieje w systemie!" });
      }
    }
  }
);

/**
 * @swagger
 * /users/Login:
 *    post:
 *      tags:
 *      - name: Users
 *      summary: Login in system
 *      parameters:
 *        - in: body
 *          name: Login
 *          description: The user login with data wchich his entered.
 *          schema:
 *            type: object
 *            required: true
 *            properties:
 *              user_email:
 *                type: string
 *                example: exampleEmailAdress@gmail.com
 *              user_password:
 *                type: string
 *                example: password@
 *      responses:
 *        200:
 *          description: System will return token.
 *        400:
 *          description: Error about entered data.
 *        404:
 *          description: Data not found.
 */
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
    if (!error.isEmpty()) {
      res.status(400).json(error.mapped());
    } else {
      const checkEneteredEmailAdress = await checkIfUserEmailExists(
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
              res.status(200).json({ Token: generatedTokenForUser });
            } else {
              res.status(400).json({ Error: "Nie udało się zalogować!" });
            }
          } else {
            res
              .status(404)
              .json({ Error: "Coś poszło nie tak. Sprawdź wprowadzone dane!" });
          }
        } else {
          res
            .status(404)
            .json({ Error: "Nie odnaleziono uprawnień dla tego użytkownika!" });
        }
      } else {
        res
          .status(400)
          .json({ Error: "Wprowadzony adress e-mail nie istnieje!" });
      }
    }
  }
);

/**
 * @swagger
 * /users/delete:
 *    post:
 *      tags:
 *      - name: Users
 *      summary: Delete account
 *      parameters:
 *        - in: body
 *          name: Delete
 *          description: The user delete his account.
 *          schema:
 *            type: object
 *            required: true
 *            properties:
 *              user_password:
 *                type: string
 *                example: password@
 *              confirm_password:
 *                type: string
 *                example: password@
 *      responses:
 *        200:
 *          description: System will return token.
 *        400:
 *          description: Error about entered data.
 *        404:
 *          description: Data not found.
 */
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
            console.log(authData);
            const checkUser = await checkIfUserEmailExists(
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
                  res
                    .status(200)
                    .json({ Message: "Pomyślnie usunięto konto!" });
                } else {
                  res.status(400).json({
                    Error: "Coś poszło nie tak. Sprawdź wprowadzone dane!",
                  });
                }
              } else {
                res.status(404).json({ Error: "Nie odnaleziono danych!" });
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
