import { Router } from "express";
import { acceptBookingController, createBookingController, declineBookingController, getBookingByIdController, getMyBookingsController } from "../controllers/booking.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { handleValidation } from "../validations/auth.validation.js";
import { bookingIdValidation, createBookingValidation } from "../validations/booking.validation.js";

const router = Router();
router.get("/me", requireAuth, getMyBookingsController);
router.patch("/:id/accept", requireAuth, bookingIdValidation, handleValidation, acceptBookingController);
router.patch("/:id/decline", requireAuth, bookingIdValidation, handleValidation, declineBookingController);
router.get("/:id", requireAuth, bookingIdValidation, handleValidation, getBookingByIdController);
router.post("/", requireAuth, createBookingValidation, handleValidation, createBookingController);
export default router;
