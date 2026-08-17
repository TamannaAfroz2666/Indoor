// @ts-nocheck
import { matchedData } from "express-validator";
import { createVenueService, getVenuesService } from "../services/venue.service.js";

export async function getVenuesController(_req, res, next) {
  try {
    const venues = await getVenuesService();

    return res.json({
      success: true,
      data: {
        venues,
        count: venues.length,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function createVenueController(req, res, next) {
  try {
    const payload = matchedData(req, { locations: ["body"] });
    const venue = await createVenueService(payload, req.userId);

    return res.status(201).json({
      success: true,
      message: "Venue created successfully",
      data: { venue },
    });
  } catch (error) {
    next(error);
  }
}
