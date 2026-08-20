import { OwnerBookingRequestsPage } from "@/features/booking/OwnerBookingRequestsPage";

export default async function Page({ params }: { params: Promise<{ venueId: string }> }) {
  const { venueId } = await params;
  return <OwnerBookingRequestsPage venueId={venueId} />;
}
