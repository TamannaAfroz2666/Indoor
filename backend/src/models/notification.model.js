import { prisma } from "../config/prisma.js";
/**
 * @param {import("@prisma/client").Prisma.TransactionClient} tx
 * @param {import("@prisma/client").Prisma.NotificationUncheckedCreateInput} data
 */

export function createNotification(tx, data) {
    return tx.notification.create({
        data: {
            type: data.type,
            recipientId: data.recipientId,
            actorId: data.actorId,
            bookingRequestId: data.bookingRequestId,
            title: data.title,
            message: data.message,
            dedupeKey: data.dedupeKey,
        }

    })
}


/**
 * @param {string} recipientId
 * @param {number} skip
 * @param {number} take
 */

export function findNotifications(recipientId, skip, take) {
  return prisma.notification.findMany({
    where: { recipientId },
    orderBy: [
      { createdAt: "desc" },
      { id: "desc" },
    ],
    skip,
    take,
    select: {
      id: true,
      type: true,
      title: true,
      message: true,
      readAt: true,
      createdAt: true,
      bookingRequestId: true,

      actor: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },

      bookingRequest: {
        select: {
          id: true,
          venueId: true,
          spaceId: true,
          startAt: true,
          duration: true,
          participants: true,
          message: true,
          estimatedRate: true,
          status: true,
        },
      },
    },
  });
}

/** @param {string} recipientId */
export function countNotifications(recipientId) {
  return prisma.notification.count({
    where: { recipientId },
  });
}

/** @param {string} recipientId */
export function countUnreadNotifications(recipientId) {
  return prisma.notification.count({
    where: {
      recipientId,
      readAt: null,
    },
  });
}