import { prisma } from "../config/prisma.js";

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

export function createVenue(data) {
  return prisma.venue.create({ data, select: venueListSelect });
}

export function findAllVenues() {
  return prisma.venue.findMany({
    select: venueListSelect,
    orderBy: { createdAt: "desc" },
  });
}

export function getVenuesByUserId(userId) {
  return prisma.venue.findMany({
    where: { createdByUserId: userId },
    select: venueListSelect,
    orderBy: { createdAt: "desc" },
  });
}

export function findVenueById(id) {
  return prisma.venue.findUnique({
    where: { id },
    include: venueInclude,
  });
}

export function findVenueThumbnail(id) {
  return prisma.venuePhoto.findFirst({
    where: { venueId: id },
    orderBy: { sortOrder: "asc" },
    select: { url: true, mimeType: true },
  });
}
