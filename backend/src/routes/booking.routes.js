import { Router } from "express";
import { createBookingController, getBookingByIdController, getMyBookingsController } from "../controllers/booking.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { handleValidation } from "../validations/auth.validation.js";
import { createBookingValidation } from "../validations/booking.validation.js";

const router = Router();
router.get("/me", requireAuth, getMyBookingsController);
router.get("/:id", requireAuth, getBookingByIdController);
router.post("/", requireAuth, createBookingValidation, handleValidation, createBookingController);
export default router;
