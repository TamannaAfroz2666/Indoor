import { apiRequest } from "./api-client";

export type CreateBookingInput = { venueId: string; spaceId: string; startAt: string; duration: number; participants?: number; message?: string };
export type BookingResult = {
  booking: { id: string; venueId: string; spaceId: string; startAt: string; duration: number; participants: number | null; hourlyRate: number; estimatedRate: number; status: "PENDING" };
  contact: { phone: string };
};

export type BookingStatus = "PENDING" | "ACCEPTED" | "DECLINED" | "CANCELLED";
export type MyBooking = {
  id: string; status: BookingStatus; startAt: string; duration: number; participants: number | null;
  estimatedRate: number; createdAt: string;
  venue: { id: string; name: string; slug: string; venueType: string; area: string; city: string; photo: string | null };
  space: { id: string; name: string; sport: string };
};
export type BookingDetails = Omit<MyBooking, "venue" | "space"> & {
  message: string | null; hourlyRate: number; updatedAt: string;
  venue: MyBooking["venue"] & { address1: string; address2: string | null; phone: string };
  space: MyBooking["space"] & { hourlyRate: number };
};

export const bookingApi = {
  create: (body: CreateBookingInput) => apiRequest<BookingResult>("/bookings", { method: "POST", body }),
  getMine: (signal?: AbortSignal) => apiRequest<{ bookings: MyBooking[] }>("/bookings/me", { method: "GET", signal, cache: "no-store" }),
  getById: (id: string, signal?: AbortSignal) => apiRequest<{ booking: BookingDetails }>(`/bookings/${encodeURIComponent(id)}`, { method: "GET", signal, cache: "no-store" }),
};
