import { body, validationResult } from 'express-validator';


export const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 80 })
    .withMessage("Name must be between 2 and 80 characters"),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^01[3-9]\d{8}$/)
    .withMessage("Enter a valid Bangladeshi phone number"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Enter a valid email")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 72 })
    .withMessage("Password must be at least 8 characters"),

  body("accountType")
    .notEmpty()
    .withMessage("Account type is required")
    .isIn(["USER", "VENUE_OWNER"])
    .withMessage("Account type must be USER or VENUE_OWNER"),
];


export const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Enter a valid email")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];


// @ts-ignore
export function handleValidation(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(arr => ({
                // @ts-ignore
                field: arr.path,
                message: arr.msg
            }))
        })
    }
    next()

}