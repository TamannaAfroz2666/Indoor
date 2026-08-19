import { matchedData } from "express-validator";
import { createBookingService } from "../services/booking.service.js";

/** @param {import('express').Request & { userId?: string }} req @param {import('express').Response} res @param {import('express').NextFunction} next */
export async function createBookingController(req, res, next) {
  try {
    if (!req.userId) return res.status(401).json({ success: false, error: "Authentication required" });
    const result = await createBookingService(matchedData(req, { locations: ["body"] }), req.userId);
    return res.status(201).json({ success: true, message: "Booking request sent successfully", data: result });
  } catch (error) { next(error); }
}
