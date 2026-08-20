import { body, param } from "express-validator";

export const bookingIdValidation = [
  param("id").isUUID().withMessage("A valid booking id is required"),
];

export const createBookingValidation = [
  body("venueId").isUUID().withMessage("A valid venueId is required"),
  body("spaceId").isUUID().withMessage("A valid spaceId is required"),
  body("startAt").isISO8601({ strict: true }).withMessage("startAt must be a valid ISO date and time"),
  body("duration").isInt({ min: 1, max: 10080 }).withMessage("duration must be a positive integer in minutes").toInt(),
  body("participants").optional({ values: "null" }).isInt({ min: 1, max: 1000000 }).withMessage("participants must be a positive integer").toInt(),
  body("message").optional({ values: "falsy" }).isString().trim().isLength({ max: 500 }).withMessage("message must not exceed 500 characters"),
  body().custom((value) => {
    const allowed = new Set(["venueId", "spaceId", "startAt", "duration", "participants", "message"]);
    const forbidden = Object.keys(value || {}).filter((key) => !allowed.has(key));
    if (forbidden.length) throw new Error(`Unsupported booking fields: ${forbidden.join(", ")}`);
    return true;
  }),
];
