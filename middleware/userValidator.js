// I M P O R T:  E X T E R N A L  D E P E N D E N C I E S
import {body} from 'express-validator';

// C R E A T E   V A L I D A T O R
export const userValidator = [
  body("userName")
    .notEmpty()
    .withMessage("Username has to bet set!")
    .isAlpha("de-DE", {ignore: " -"})
    .withMessage("Username contains not allowed signs!")
    .trim() // takes out whitespaces at the beginning and the end of an string
    .escape(), // changes special chars into normal chars
  body("email")
    .notEmpty()
    .withMessage("Email has to be set!")
    .trim()
    .isEmail()
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password has to bet set!")
    .trim()
    .isStrongPassword()
    .withMessage("Password isn't safe enough!")
    .isLength({min:8})
]

export const userUpdateValidator = [
  body("UserName")
    .optional()
    .isAlpha("de-DE", {ignore: " -"})
    .withMessage("Username contains not allowed signs!")
    .trim(),
]

// normalize() => changes all chars to lowerCase

