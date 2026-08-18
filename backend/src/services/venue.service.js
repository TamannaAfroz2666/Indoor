import { createVenue, findAllVenues, getVenuesByUserId } from "../models/venue.model.js";

function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "venue";
}

function optional(value) {
  const normalized = value?.trim();
  return normalized || null;
}

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
      create: photos.map((photo, sortOrder) => ({
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
      const slugConflict = error?.code === "P2002" &&
        (error?.meta?.target === "Venue_slug_key" || error?.meta?.target?.includes?.("slug"));
      if (!slugConflict) throw error;
    }
  }

  const error = new Error("Unable to generate a unique venue slug");
  error.statusCode = 409;
  throw error;
}

export function getVenuesService() {
  return findAllVenues();
}

export function getProfileVenuesService(userId) {
  return getVenuesByUserId(userId);
}