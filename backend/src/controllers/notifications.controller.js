import { getNotificationsService } from '../services/notifications.service.js';


/** @param {import('express').Request & { userId?: string }} 
 * req @param {import('express').Response} 
 * res @param {import('express').NextFunction} next */

export async function getNotifications(req, res, next) {
    try {
        if (!req.userId)
            return res.status(401).json({ success: false, error: "Authentication required" });
        const result = await getNotificationsService(req.userId,  req.query);
         return res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
}