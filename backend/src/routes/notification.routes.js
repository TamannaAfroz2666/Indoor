import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { getNotifications } from "../controllers/notifications.controller.js";


const router = Router();
// router.post("/", requireAuth, createNotifications);

router.get("/", requireAuth, getNotifications);


export default router;