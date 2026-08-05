import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getVenueById,
  venues,
} from "@/utils/data/featuredVenues";

import VenueDetailsView from "@/features/venue/venue-details/VenueDetailsView";

type VenueDetailsPageProps = {
  params: Promise<{
    venueId: string;
  }>;
};

export function generateStaticParams() {
  return venues.map((venue) => ({
    venueId: venue.id,
  }));
}

export async function generateMetadata({
  params,
}: VenueDetailsPageProps): Promise<Metadata> {
  const { venueId } = await params;
  const venue = getVenueById(venueId);

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

  const venue = getVenueById(venueId);

  if (!venue) {
    notFound();
  }

  return <VenueDetailsView venue={venue} />;
}