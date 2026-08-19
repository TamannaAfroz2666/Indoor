import { BookingDetailsPage } from "@/features/booking/BookingDetailsPage";

export default async function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BookingDetailsPage bookingId={id} />;
}
