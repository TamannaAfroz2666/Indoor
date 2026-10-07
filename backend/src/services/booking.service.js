import { createBookingWithConflictCheck, findBookingByIdForUser, findBookingForOwnerTransition, findBookingsByUserId, findBookingsByVenueId, findBookingVenueAndSpace, findVenueBookingOwner, updatePendingBookingStatus, withBookingTransaction } from "../models/booking.model.js";
import { createNotification } from "../models/notification.model.js";

/** @param {string} message @param {number} [statusCode] @returns {never} */
const fail = (message, statusCode = 400) => { throw Object.assign(new Error(message), { statusCode }); };

/** @param {{ venueId: string, spaceId: string, startAt: string, duration: number, participants?: number, message?: string }} payload @param {string} userId */


export async function createBookingService(payload, userId) {
  const venue = await findBookingVenueAndSpace(
    payload.venueId,
    payload.spaceId
  );

  if (!venue) fail("Venue not found", 404);

  const space = venue.spaces[0];
  if (!space) fail("Space not found at this venue", 404);

  const startAt = new Date(payload.startAt);
  const now = new Date();

  if (!Number.isFinite(startAt.getTime()) || startAt <= now) {
    fail("startAt must be in the future");
  }

  const duration = payload.duration;

  if (
    !Number.isInteger(duration) ||
    duration < venue.minimumBookingMinutes ||
    duration > venue.maximumBookingMinutes
  ) {
    fail(
      `duration must be between ${venue.minimumBookingMinutes} and ${venue.maximumBookingMinutes} minutes`
    );
  }

  const participants = payload.participants ?? null;

  if (
    participants !== null &&
    (!Number.isInteger(participants) ||
      participants < 1 ||
      participants > venue.maximumParticipants)
  ) {
    fail(
      `participants must be between 1 and ${venue.maximumParticipants}`
    );
  }

  const earliest = new Date(
    now.getTime() + venue.bookingLeadTime * 60 * 60 * 1000
  );

  if (startAt < earliest) {
    fail(
      `Bookings require at least ${venue.bookingLeadTime} hours lead time`
    );
  }

  const latest = new Date(
    now.getTime() + venue.advanceBookingDays * 24 * 60 * 60 * 1000
  );

  if (startAt > latest) {
    fail(
      `Bookings can only be made ${venue.advanceBookingDays} days in advance`
    );
  }


  // ownerId তোমার actual Venue owner field অনুযায়ী মিলিয়ে নেবে
  const ownerId = venue.createdByUserId;
  console.log({
    venueId: venue.id,
    recipientId: ownerId,
    actorId: userId,
  });
  if (!ownerId) {
    fail("Venue owner not found", 500);
  }

  const endAt = new Date(startAt.getTime() + duration * 60000);

  const estimatedRate = Math.round(
    (space.hourlyRate * duration) / 60
  );

  const booking = await withBookingTransaction(async (tx) => {
    const createdBooking = await createBookingWithConflictCheck(
      {
        userId,
        venueId: venue.id,
        spaceId: space.id,
        startAt,
        duration,
        participants,
        message: payload.message?.trim() || null,
        hourlyRate: space.hourlyRate,
        estimatedRate,
        status: "PENDING",
      },
      endAt,
      tx
    );

    await createNotification(tx, {
      type: "BOOKING_REQUESTED",
      recipientId: ownerId,
      actorId: userId,
      bookingRequestId: createdBooking.id,
      title: "New booking request",
      message: "A player wants to book your turf. Review the request.",
      dedupeKey: `booking:${createdBooking.id}:requested:${ownerId}`,
    });

    return createdBooking;
  });

  return {
    booking,
    contact: {
      phone: venue.phone,
    },
  };
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

/** @param {string} id @param {string} ownerUserId @param {"ACCEPTED" | "DECLINED"} nextStatus */
export async function transitionBookingByOwnerService(id, ownerUserId, nextStatus) {
  const booking = await findBookingForOwnerTransition(id);
  if (!booking) fail("Booking request not found", 404);
  if (booking.venue.createdByUserId !== ownerUserId) fail("You do not have permission to update this booking request", 403);
  if (booking.status !== "PENDING") fail(`Only pending booking requests can be ${nextStatus.toLowerCase()}`, 409);

  const updated = await updatePendingBookingStatus(id, nextStatus, ownerUserId);
  if (!updated) fail("Booking request is no longer pending", 409);
  return updated;
}
