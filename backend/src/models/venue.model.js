import { prisma } from "../config/prisma.js";

/** @type {import('@prisma/client').Prisma.VenueInclude} */
const venueInclude = {
  photos: { orderBy: { sortOrder: "asc" } },
  createdByUser: {
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatar: true,
      accountType: true,
    },
  },
};

/** @type {import('@prisma/client').Prisma.VenueSelect} */
const venueListSelect = {
  id: true,
  name: true,
  slug: true,
  venueType: true,
  bookingMode: true,
  businessStatus: true,
  address1: true,
  address2: true,
  area: true,
  city: true,
  minimumBookingMinutes: true,
  maximumBookingMinutes: true,
  courtTypes: true,
  createdAt: true,
  updatedAt: true,
  photos: {
    orderBy: { sortOrder: "asc" },
    take: 1,
    select: { id: true, name: true, mimeType: true, size: true, sortOrder: true },
  },
  _count: { select: { photos: true } },
};

/** @param {import('@prisma/client').Prisma.VenueCreateArgs['data']} data */
export function createVenue(data) {
  return prisma.venue.create({ data, select: venueListSelect });
}

export function findAllVenues() {
  return prisma.venue.findMany({
    select: venueListSelect,
    orderBy: { createdAt: "desc" },
  });
}

/** @param {string} userId */
export function getVenuesByUserId(userId) {
  return prisma.venue.findMany({
    where: { createdByUserId: userId },
    select: venueListSelect,
    orderBy: { createdAt: "desc" },
  });
}

/** @param {string} id */
export function findVenueById(id) {
  return prisma.venue.findUnique({
    where: { id },
    include: venueInclude,
  });
}

/** @param {string} id */
export function findVenueThumbnail(id) {
  return prisma.venuePhoto.findFirst({
    where: { venueId: id },
    orderBy: { sortOrder: "asc" },
    select: { url: true, mimeType: true },
  });
}
