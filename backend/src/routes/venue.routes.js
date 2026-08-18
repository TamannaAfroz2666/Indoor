import { Router } from "express";
import {
    createVenueController,
    getMyVenuesController,
    getVenueByIdController,
    getVenueThumbnailController,
    getVenuesController
} from "../controllers/venue.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { handleValidation } from "../validations/auth.validation.js";
import { createVenueValidation } from "../validations/venue.validation.js";

const router = Router();

router.get("/", getVenuesController);
router.post("/", requireAuth, createVenueValidation, handleValidation, createVenueController);

router.get("/mine", requireAuth, getMyVenuesController);
router.get("/:venueId/thumbnail", getVenueThumbnailController);
router.get("/:venueId", getVenueByIdController);

export default router;
