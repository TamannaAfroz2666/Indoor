import type { BookingStatus } from "@/lib/booking-api";

export const bookingStatusStyle: Record<BookingStatus, { label: string; className: string }> = {
  PENDING: { label: "Pending Approval", className: "bg-amber-50 text-amber-700 ring-amber-200" },
  ACCEPTED: { label: "Accepted", className: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  DECLINED: { label: "Declined", className: "bg-red-50 text-red-700 ring-red-200" },
  CANCELLED: { label: "Cancelled", className: "bg-slate-100 text-slate-600 ring-slate-200" },
};
export const bookingCurrency = new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 0 });
export const bookingDateFormat = new Intl.DateTimeFormat("en-BD", { day: "2-digit", month: "short", year: "numeric" });
export const bookingTimeFormat = new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit" });
