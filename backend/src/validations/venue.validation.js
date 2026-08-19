import { body } from "express-validator";

const venueTypes = ["Turf", "Sports Complex", "Indoor Court", "Event Space", "Training Facility"];
const bookingModes = ["Online bookings", "Offline bookings", "Online & Offline bookings"];
const businessStatuses = ["Registered business", "Individual owner", "Non-profit / Community"];
const facilities = ["Changing Room", "Restroom", "Parking", "Refreshments / Cafe", "Flood Lights", "Equipment Rental"];
const environments = ["Indoor", "Outdoor"];
const courtTypes = ["Football", "Cricket", "Badminton", "Basketball", "Tennis", "Multi-sport"];
const highlights = ["Air Conditioned", "Clean & Hygienic", "Safe & Secure", "Professional Staff", "Locker Facility", "Wheelchair Accessible"];

/** @param {string} path @param {string} label @param {number} max */
const requiredText = (path, label, max) => body(path)
  .isString().withMessage(`${label} must be text`)
  .bail()
  .trim()
  .notEmpty().withMessage(`${label} is required`)
  .isLength({ max }).withMessage(`${label} must not exceed ${max} characters`);

/** @param {string} path @param {string} label @param {number} max */
const optionalText = (path, label, max) => body(path)
  .optional({ values: "falsy" })
  .isString().withMessage(`${label} must be text`)
  .bail()
  .trim()
  .isLength({ max }).withMessage(`${label} must not exceed ${max} characters`);

/** @param {string} path @param {string} label @param {number} max */
const positiveInteger = (path, label, max) => body(path)
  .notEmpty().withMessage(`${label} is required`)
  .bail()
  .isInt({ min: 1, max }).withMessage(`${label} must be an integer between 1 and ${max}`)
  .toInt();

/** @param {string} path @param {string} label @param {string[]} allowed @param {boolean} [required] */
const selectionArray = (path, label, allowed, required = true) => body(path)
  .isArray({ min: required ? 1 : 0, max: allowed.length })
  .withMessage(required ? `Select at least one ${label}` : `${label} must be an array`)
  .bail()
  .custom((values) => {
    if (new Set(values).size !== values.length || values.some(/** @param {string} value */ (value) => !allowed.includes(value))) {
      throw new Error(`${label} contains an invalid or duplicate selection`);
    }
    return true;
  });

export const createVenueValidation = [
  requiredText("basicInfo.venueName", "Venue name", 120),
  body("basicInfo.venueType").isIn(venueTypes).withMessage("Select a valid venue type"),
  requiredText("basicInfo.description", "Description", 500),
  body("basicInfo.bookingMode").isIn(bookingModes).withMessage("Select a valid booking mode"),
  requiredText("basicInfo.phone", "Phone number", 30)
    .matches(/^\+?[0-9][0-9\s()-]{7,28}$/).withMessage("Enter a valid phone number"),
  body("basicInfo.email").trim().notEmpty().withMessage("Email address is required")
    .bail().isEmail().withMessage("Enter a valid email address").normalizeEmail(),
  body("basicInfo.website").optional({ values: "falsy" }).trim()
    .isURL({ protocols: ["http", "https"], require_protocol: true }).withMessage("Website must begin with http:// or https://")
    .isLength({ max: 2048 }).withMessage("Website URL is too long"),
  body("basicInfo.businessStatus").optional({ values: "falsy" })
    .isIn(businessStatuses).withMessage("Select a valid business status"),

  requiredText("location.address1", "Address line 1", 200),
  optionalText("location.address2", "Address line 2", 200),
  requiredText("location.area", "Area", 100),
  requiredText("location.city", "City", 100),
  requiredText("location.district", "District", 100),
  requiredText("location.division", "Division", 100),
  optionalText("location.postalCode", "Postal code", 20),
  requiredText("location.country", "Country", 100),

  positiveInteger("details.venueSize", "Venue size", 100000000),
  positiveInteger("details.maximumParticipants", "Maximum participants", 1000000),
  positiveInteger("details.minimumBookingMinutes", "Minimum booking minutes", 10080),
  positiveInteger("details.maximumBookingMinutes", "Maximum booking minutes", 10080),
  positiveInteger("details.bookingLeadTime", "Booking lead time", 8760),
  positiveInteger("details.advanceBookingDays", "Advance booking days", 3650),
  body("details.maximumBookingMinutes").custom((maximum, { req }) => {
    if (Number(maximum) < Number(req.body?.details?.minimumBookingMinutes)) {
      throw new Error("Maximum booking time cannot be less than the minimum");
    }
    return true;
  }),
  requiredText("details.cancellationPolicy", "Cancellation policy", 500),
  requiredText("details.houseRules", "House rules", 500),

  selectionArray("amenities.facilities", "sports facility", facilities),
  selectionArray("amenities.environment", "environment", environments),
  selectionArray("amenities.courtTypes", "court type", courtTypes),
  selectionArray("amenities.highlights", "highlight", highlights, false),

  body("photos").isArray({ min: 1, max: 8 }).withMessage("Add between 1 and 8 venue photos"),
  requiredText("photos.*.name", "Photo name", 255),
  body("photos.*.type").isIn(["image/jpeg", "image/png", "image/webp"])
    .withMessage("Photos must be JPG, PNG, or WebP images"),
  body("photos.*.size").isInt({ min: 1, max: 10 * 1024 * 1024 })
    .withMessage("Each photo must be 10 MB or smaller").toInt(),
  body("photos.*.preview").isString().withMessage("Photo data is required")
    .bail().matches(/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/)
    .withMessage("Photo data must be a valid JPG, PNG, or WebP data URL"),
  body("spaces").isArray({ min: 1, max: 50 }).withMessage("Add between 1 and 50 bookable spaces"),
  requiredText("spaces.*.name", "Space name", 120),
  body("spaces.*.sport").isIn(courtTypes).withMessage("Select a valid sport for each space"),
  body("spaces.*.hourlyRate").isInt({ min: 1, max: 100000000 }).withMessage("Hourly rate must be a positive integer").toInt(),
  body("spaces").custom((spaces, { req }) => {
    if (!Array.isArray(spaces)) return true;
    const names = spaces.map((space) => String(space.name || "").trim().toLowerCase());
    if (new Set(names).size !== names.length) throw new Error("Space names must be unique");
    if (spaces.some((space) => !req.body?.amenities?.courtTypes?.includes(space.sport))) throw new Error("Each space sport must be selected as a court type");
    return true;
  }),
];
