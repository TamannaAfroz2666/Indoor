import { apiRequest } from "./api-client";
import type { BookingStatus } from "./booking-api";

export type Notification = {
  id: string; type: string; title: string; message: string; readAt: string | null;
  createdAt: string; bookingRequestId: string | null;
  actor: { id: string; name: string | null; avatar: string | null } | null;
  bookingRequest: {
    id: string; venueId: string; spaceId: string; startAt: string; duration: number;
    participants: number | null; message: string | null; estimatedRate: number; status: BookingStatus;
  } | null;
};
export type NotificationPage = {
  notifications: Notification[]; unreadCount: number;
  pagination: { page: number; limit: number; total: number; totalPages: number; hasNextPage: boolean };
};
async function list(page = 1, signal?: AbortSignal): Promise<NotificationPage> {
  return apiRequest<NotificationPage>(`/notifications?page=${page}&limit=20`, { method: "GET", signal, cache: "no-store" });
}

// Saved notifications only; actions remain disabled in the dropdown.
export const notificationApi = { list };
