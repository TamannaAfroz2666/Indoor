import { prisma } from "../config/prisma.js";

/** @param {string} venueId @param {string} spaceId */
export function findBookingVenueAndSpace(venueId, spaceId) {
  return prisma.venue.findUnique({
    where: { id: venueId },
    select: {
      id: true, name: true, phone: true, maximumParticipants: true,
      minimumBookingMinutes: true, maximumBookingMinutes: true,
      bookingLeadTime: true, advanceBookingDays: true,
      spaces: { where: { id: spaceId }, select: { id: true, venueId: true, name: true, sport: true, hourlyRate: true } },
    },
  });
}

/** @param {import('@prisma/client').Prisma.BookingRequestCreateInput | any} data @param {Date} endAt */
export function createBookingWithConflictCheck(data, endAt) {

  return prisma.$transaction(async (tx) => {

    const venue = await tx.venue.findUnique({
      where: {
        id: data.venueId,
      },
      select: {
        id: true,
        createdByUserId: true,
      },
    });

    if (!venue) {
      throw Object.assign(new Error("Venue not found"), {
        statusCode: 404,
      });
    }

    // 2. control self booking access
    if (venue.createdByUserId === data.userId) {
      throw Object.assign(
        new Error("You cannot book your own venue"),
        { statusCode: 400 }
      );
    }

    const candidates = await tx.bookingRequest.findMany({
      where: { spaceId: data.spaceId, status: { in: ["PENDING", "ACCEPTED"] }, startAt: { lt: endAt } },
      select: { startAt: true, duration: true },
    });
    const overlaps = candidates.some((booking) => new Date(booking.startAt.getTime() + booking.duration * 60000) > data.startAt);
    if (overlaps) throw Object.assign(new Error("This space already has a pending or accepted booking during that time"), { statusCode: 409 });
    // old 
    // return tx.bookingRequest.create({
    //   data,
    //   select: { id: true, venueId: true, spaceId: true, startAt: true, duration: true, participants: true, hourlyRate: true, estimatedRate: true, status: true },
    // });

    const bookingRequest = await tx.bookingRequest.create({
      data,
      select: { id: true, venueId: true, spaceId: true, startAt: true, duration: true, participants: true, hourlyRate: true, estimatedRate: true, status: true },
    });
    await tx.notification.create({
      data: {
        type: "BOOKING_REQUESTED",

        // যিনি booking request পাঠিয়েছেন
        actorId: data.userId,

        // যিনি notification পাবেন
        recipientId: venue.createdByUserId,

        // নতুন booking-এর ID
        bookingRequestId: bookingRequest.id,
        title: "New booking request",
        message: "You have received a new booking request.",
      },
    });

    // 6. Created booking return
    return bookingRequest;
  },
    {
      isolationLevel: "Serializable",
    }
  );


}

/** @param {string} userId */
export function findBookingsByUserId(userId) {
  return prisma.bookingRequest.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      status: true,
      startAt: true,
      duration: true,
      participants: true,
      estimatedRate: true,
      createdAt: true,
      venue: {
        select: {
          id: true,
          name: true,
          slug: true,
          venueType: true,
          area: true,
          city: true,
          photos: {
            orderBy: { sortOrder: "asc" },
            take: 1,
            select: { url: true },
          },
        },
      },
      space: { select: { id: true, name: true, sport: true } },
    },
  });
}

/** @param {string} id @param {string} userId */
export function findBookingByIdForUser(id, userId) {
  return prisma.bookingRequest.findFirst({
    where: { id, userId },
    select: {
      id: true,
      status: true,
      startAt: true,
      duration: true,
      participants: true,
      message: true,
      hourlyRate: true,
      estimatedRate: true,
      createdAt: true,
      updatedAt: true,
      venue: {
        select: {
          id: true,
          name: true,
          slug: true,
          venueType: true,
          address1: true,
          address2: true,
          area: true,
          city: true,
          phone: true,
          photos: { orderBy: { sortOrder: "asc" }, take: 1, select: { url: true } },
        },
      },
      space: { select: { id: true, name: true, sport: true, hourlyRate: true } },
    },
  });
}

/** @param {string} venueId */
export function findVenueBookingOwner(venueId) {
  return prisma.venue.findUnique({
    where: { id: venueId },
    select: { id: true, createdByUserId: true },
  });
}

/** @param {string} venueId */
export function findBookingsByVenueId(venueId) {
  return prisma.bookingRequest.findMany({
    where: { venueId },
    orderBy: [{ createdAt: "desc" }, { startAt: "asc" }],
    select: {
      id: true, status: true, startAt: true, duration: true, participants: true,
      message: true, hourlyRate: true, estimatedRate: true, createdAt: true, updatedAt: true,
      user: { select: { id: true, name: true, avatar: true, phone: true } },
      venue: { select: { id: true, name: true, venueType: true } },
      space: { select: { id: true, name: true, sport: true } },
    },
  });
}

/** @param {string} id */
export function findBookingForOwnerTransition(id) {
  return prisma.bookingRequest.findUnique({
    where: { id },
    select: {
      id: true,
      status: true,
      venue: { select: { createdByUserId: true } },
    },
  });
}

/** @param {string} id @param {"ACCEPTED" | "DECLINED"} status @param {string} ownerUserId */
export async function updatePendingBookingStatus(id, status, ownerUserId) {
  const result = await prisma.bookingRequest.updateMany({
    where: { id, status: "PENDING", venue: { createdByUserId: ownerUserId } },
    data: { status },
  });
  if (result.count !== 1) return null;
  return prisma.bookingRequest.findUnique({
    where: { id },
    select: { id: true, status: true, updatedAt: true },
  });
}
