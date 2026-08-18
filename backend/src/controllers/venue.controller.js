import { matchedData } from "express-validator";
import {
  createVenueService,
  getMyVenuesService,
  getVenueByIdService,
  getVenueThumbnailService,
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

export async function getVenueThumbnailController(req, res, next) {
  try {
    const photo = await getVenueThumbnailService(req.params.venueId);
    if (!photo) return res.status(404).end();

    if (/^https?:\/\//i.test(photo.url)) return res.redirect(photo.url);
    const match = photo.url.match(/^data:(image\/(?:jpeg|png|webp));base64,(.+)$/);
    if (!match) return res.status(404).end();

    res.set({
      "Cache-Control": "public, max-age=31536000, immutable",
      "Cross-Origin-Resource-Policy": "cross-origin",
      "Content-Type": match[1],
    });
    return res.send(Buffer.from(match[2], "base64"));
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
