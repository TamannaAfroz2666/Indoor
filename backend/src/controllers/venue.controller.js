import { matchedData } from "express-validator";
import {
  createVenueService,
  getMyVenuesService,
  getVenueByIdService,
  getVenuesService
} from "../services/venue.service.js";

// @ts-ignore
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

export async function getVenueByIdController(req, res, next) {
  try {
    const venue = await getVenueByIdService(req.params.venueId);
    if (!venue) return res.status(404).json({ error: "Venue not found" });
    return res.json({ success: true, data: { venue } });
  } catch (error) {
    next(error);
  }
}

export async function getMyVenuesController(req, res, next) {
  try {
    const venues = await getMyVenuesService(req.userId);

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
