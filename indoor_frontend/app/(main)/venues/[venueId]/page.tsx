import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { toVenueDetails, venueApi } from "@/lib/venue-api";

import VenueDetailsView from "@/features/venue/venue-details/VenueDetailsView";

type VenueDetailsPageProps = {
  params: Promise<{
    venueId: string;
  }>;
};

export const dynamic = "force-dynamic";

async function findVenue(venueId: string) {
  const { venues } = await venueApi.getAll();
  const venue = venues.find((item) => item.id === venueId);
  return venue ? toVenueDetails(venue) : null;
}

export async function generateMetadata({
  params,
}: VenueDetailsPageProps): Promise<Metadata> {
  const { venueId } = await params;
  const venue = await findVenue(venueId);

  if (!venue) {
    return {
      title: "Venue not found",
    };
  }

  return {
    title: `${venue.name} | Indoor`,
    description: venue.description,
  };
}

export default async function VenueDetailsPage({
  params,
}: VenueDetailsPageProps) {
  const { venueId } = await params;

  const venue = await findVenue(venueId);

  if (!venue) {
    notFound();
  }

  return <VenueDetailsView venue={venue} />;
}
