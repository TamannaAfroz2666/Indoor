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

export function createVenue(data) {
  return prisma.venue.create({ data, include: venueInclude });
}

export function findAllVenues() {
  return prisma.venue.findMany({
    include: venueInclude,
    orderBy: { createdAt: "desc" },
  });
}

export function getVenuesByUserId(userId) {
  return prisma.venue.findMany({
    where: { createdByUserId: userId },
    orderBy: { createdAt: "desc" },
  });
}
