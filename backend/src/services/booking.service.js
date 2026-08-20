import { createBookingWithConflictCheck, findBookingByIdForUser, findBookingsByUserId, findBookingsByVenueId, findBookingVenueAndSpace, findVenueBookingOwner } from "../models/booking.model.js";

/** @param {string} message @param {number} [statusCode] @returns {never} */
const fail = (message, statusCode = 400) => { throw Object.assign(new Error(message), { statusCode }); };

/** @param {{ venueId: string, spaceId: string, startAt: string, duration: number, participants?: number, message?: string }} payload @param {string} userId */
export async function createBookingService(payload, userId) {
  const venue = await findBookingVenueAndSpace(payload.venueId, payload.spaceId);
  if (!venue) fail("Venue not found", 404);
  const space = venue.spaces[0];
  if (!space) fail("Space not found at this venue", 404);

  const startAt = new Date(payload.startAt);
  const now = new Date();
  if (!Number.isFinite(startAt.getTime()) || startAt <= now) fail("startAt must be in the future");
  if (payload.duration < venue.minimumBookingMinutes || payload.duration > venue.maximumBookingMinutes) {
    fail(`duration must be between ${venue.minimumBookingMinutes} and ${venue.maximumBookingMinutes} minutes`);
  }
  if (payload.participants && payload.participants > venue.maximumParticipants) fail(`participants cannot exceed ${venue.maximumParticipants}`);
  const earliest = new Date(now.getTime() + venue.bookingLeadTime * 60 * 60 * 1000);
  if (startAt < earliest) fail(`Bookings require at least ${venue.bookingLeadTime} hours lead time`);
  const latest = new Date(now.getTime() + venue.advanceBookingDays * 24 * 60 * 60 * 1000);
  if (startAt > latest) fail(`Bookings can only be made ${venue.advanceBookingDays} days in advance`);

  const estimatedRate = Math.round(space.hourlyRate * payload.duration / 60);
  const booking = await createBookingWithConflictCheck({
    userId, venueId: venue.id, spaceId: space.id, startAt, duration: payload.duration,
    participants: payload.participants ?? null, message: payload.message?.trim() || null,
    hourlyRate: space.hourlyRate, estimatedRate, status: "PENDING",
  }, new Date(startAt.getTime() + payload.duration * 60000));

  return { booking, contact: { phone: venue.phone } };
}

/** @param {string} userId */
export async function getMyBookingsService(userId) {
  const bookings = await findBookingsByUserId(userId);
  return bookings.map(({ venue, ...booking }) => ({
    ...booking,
    venue: {
      id: venue.id,
      name: venue.name,
      slug: venue.slug,
      venueType: venue.venueType,
      area: venue.area,
      city: venue.city,
      photo: venue.photos[0]?.url ?? null,
    },
  }));
}

/** @param {string} id @param {string} userId */
export async function getBookingByIdService(id, userId) {
  const record = await findBookingByIdForUser(id, userId);
  if (!record) fail("Booking request not found", 404);
  const { venue, ...booking } = record;
  return {
    ...booking,
    venue: {
      id: venue.id, name: venue.name, slug: venue.slug, venueType: venue.venueType,
      address1: venue.address1, address2: venue.address2, area: venue.area, city: venue.city,
      phone: venue.phone, photo: venue.photos[0]?.url ?? null,
    },
  };
}

/** @param {string} venueId @param {string} userId */
export async function getVenueBookingsService(venueId, userId) {
  const venue = await findVenueBookingOwner(venueId);
  if (!venue) fail("Venue not found", 404);
  if (venue.createdByUserId !== userId) fail("You do not have access to this venue's booking requests", 403);
  return findBookingsByVenueId(venueId);
}
