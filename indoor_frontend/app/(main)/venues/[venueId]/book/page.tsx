import { notFound } from "next/navigation";
import { venueApi } from "@/lib/venue-api";
import { BookingRequestPage } from "@/features/booking/BookingRequestPage";

export const dynamic = "force-dynamic";
export default async function VenueBookPage({ params }: { params: Promise<{ venueId: string }> }) {
  const { venueId } = await params;
  let venue;
  try {
    ({ venue } = await venueApi.getById(venueId));
  } catch { notFound(); }
  // Booking limits are a request-time snapshot and are revalidated by the API.
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();
  return <BookingRequestPage venue={venue} bookingWindowStart={new Date(now + venue.bookingLeadTime * 3600000).toISOString()} bookingWindowEnd={new Date(now + venue.advanceBookingDays * 86400000).toISOString()} />;
}
