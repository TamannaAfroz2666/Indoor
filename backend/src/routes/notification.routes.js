import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { getNotifications } from "../controllers/notifications.controller.js";


const router = Router();

router.get("/", requireAuth, getNotifications);


export default router;