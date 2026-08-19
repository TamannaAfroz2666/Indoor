import { Router } from "express";
import { createBookingController } from "../controllers/booking.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { handleValidation } from "../validations/auth.validation.js";
import { createBookingValidation } from "../validations/booking.validation.js";

const router = Router();
router.post("/", requireAuth, createBookingValidation, handleValidation, createBookingController);
export default router;
