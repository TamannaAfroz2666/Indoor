import { Router } from "express";
import { createVenueController, getVenuesController } from "../controllers/venue.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { handleValidation } from "../validations/auth.validation.js";
import { createVenueValidation } from "../validations/venue.validation.js";

const router = Router();

router.get("/", getVenuesController);
router.post("/", requireAuth, createVenueValidation, handleValidation, createVenueController);

export default router;
