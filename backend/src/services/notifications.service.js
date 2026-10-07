/** @param {string} userId */

import { findBookingsByUserId } from "../models/booking.model.js";

export async function getNotificationsService(userId) {
    
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