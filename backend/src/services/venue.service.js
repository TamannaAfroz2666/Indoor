import { createVenue, findAllVenues, findVenueById, findVenueThumbnail, getVenuesByUserId } from "../models/venue.model.js";

/** @param {string} value */
function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "venue";
}

/** @param {string | null | undefined} value */
function optional(value) {
  const normalized = value?.trim();
  return normalized || null;
}

/** @param {any} payload @param {string} createdByUserId */
export async function createVenueService(payload, createdByUserId) {
  const { basicInfo, location, details, amenities, photos } = payload;
  const baseSlug = slugify(basicInfo.venueName);

  const venueData = {
    name: basicInfo.venueName.trim(),
    venueType: basicInfo.venueType.trim(),
    description: basicInfo.description.trim(),
    bookingMode: basicInfo.bookingMode.trim(),
    phone: basicInfo.phone.trim(),
    email: basicInfo.email.trim().toLowerCase(),
    website: optional(basicInfo.website),
    businessStatus: optional(basicInfo.businessStatus),
    address1: location.address1.trim(),
    address2: optional(location.address2),
    area: location.area.trim(),
    city: location.city.trim(),
    district: location.district.trim(),
    division: location.division.trim(),
    postalCode: optional(location.postalCode),
    country: location.country.trim(),
    venueSize: details.venueSize,
    maximumParticipants: details.maximumParticipants,
    minimumBookingMinutes: details.minimumBookingMinutes,
    maximumBookingMinutes: details.maximumBookingMinutes,
    bookingLeadTime: details.bookingLeadTime,
    advanceBookingDays: details.advanceBookingDays,
    cancellationPolicy: details.cancellationPolicy.trim(),
    houseRules: details.houseRules.trim(),
    facilities: amenities.facilities,
    environment: amenities.environment,
    courtTypes: amenities.courtTypes,
    highlights: amenities.highlights,
    createdByUserId,
    photos: {
      create: photos.map((/** @type {any} */ photo, /** @type {number} */ sortOrder) => ({
        name: photo.name.trim(),
        mimeType: photo.type,
        size: photo.size,
        url: photo.preview,
        sortOrder,
      })),
    },
  };

  for (let suffix = 1; suffix <= 100; suffix += 1) {
    try {
      return await createVenue({
        ...venueData,
        slug: suffix === 1 ? baseSlug : `${baseSlug}-${suffix}`,
      });
    } catch (error) {
      const databaseError = /** @type {{ code?: string, meta?: { target?: string | string[] } }} */ (error);
      const target = databaseError.meta?.target;
      const slugConflict = databaseError.code === "P2002" &&
        (target === "Venue_slug_key" || target?.includes("slug"));
      if (!slugConflict) throw error;
    }
  }

  const error = Object.assign(new Error("Unable to generate a unique venue slug"), { statusCode: 409 });
  throw error;
}

export function getVenuesService() {
  return findAllVenues();
}

/** @param {string} userId */
export function getMyVenuesService(userId) {
  return getVenuesByUserId(userId);
}

/** @param {string} id */
export function getVenueByIdService(id) {
  return findVenueById(id);
}

/** @param {string} id */
export function getVenueThumbnailService(id) {
  return findVenueThumbnail(id);
}
