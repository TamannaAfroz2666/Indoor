import { apiRequest } from "./api-client";

export type CreateBookingInput = { venueId: string; spaceId: string; startAt: string; duration: number; participants?: number; message?: string };
export type BookingResult = {
  booking: { id: string; venueId: string; spaceId: string; startAt: string; duration: number; participants: number | null; hourlyRate: number; estimatedRate: number; status: "PENDING" };
  contact: { phone: string };
};

export const bookingApi = { create: (body: CreateBookingInput) => apiRequest<BookingResult>("/bookings", { method: "POST", body }) };
