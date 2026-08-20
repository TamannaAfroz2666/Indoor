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
    const candidates = await tx.bookingRequest.findMany({
      where: { spaceId: data.spaceId, status: { in: ["PENDING", "ACCEPTED"] }, startAt: { lt: endAt } },
      select: { startAt: true, duration: true },
    });
    const overlaps = candidates.some((booking) => new Date(booking.startAt.getTime() + booking.duration * 60000) > data.startAt);
    if (overlaps) throw Object.assign(new Error("This space already has a pending or accepted booking during that time"), { statusCode: 409 });
    return tx.bookingRequest.create({
      data,
      select: { id: true, venueId: true, spaceId: true, startAt: true, duration: true, participants: true, hourlyRate: true, estimatedRate: true, status: true },
    });
  }, { isolationLevel: "Serializable" });
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
