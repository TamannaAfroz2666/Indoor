/** @param {string} userId */

import { findBookingsByUserId } from "../models/booking.model.js";
import { countNotifications, countUnreadNotifications, findNotifications } from "../models/notification.model.js";

//getnotification 

/**
 * @param {string} userId
 * @param {{ page?: unknown, limit?: unknown }} query
 */
export async function getNotificationsService(userId, query) {
  const page = Number(query.page ?? 1);
  const limit = Number(query.limit ?? 20);

  if (
    !Number.isSafeInteger(page) ||
    page < 1 ||
    !Number.isSafeInteger(limit) ||
    limit < 1 ||
    limit > 50 ||
    !Number.isSafeInteger((page - 1) * limit)
  ) {
    throw Object.assign(
      new Error("page must be a positive integer; limit must be between 1 and 50"),
      { statusCode: 400 }
    );
  }

  const [notifications, total, unreadCount] = await Promise.all([
    findNotifications(userId, (page - 1) * limit, limit),
    countNotifications(userId),
    countUnreadNotifications(userId),
  ]);

  return {
    notifications,
    unreadCount,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
    },
  };
}