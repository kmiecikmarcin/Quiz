const express = require("express");
const { check, validationResult } = require("express-validator");
const checkPasswordAboutOneSpecialKey = require("../Functions/Others/checkPasswordAboutOneSpecialKey");

const router = express.Router();

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
        if (value !== req.body.userPassword) {
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
        if (checkUserGenderInRegister(value) === false) {
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
    }
  }
);

module.exports = router;
