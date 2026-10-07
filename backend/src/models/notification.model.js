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