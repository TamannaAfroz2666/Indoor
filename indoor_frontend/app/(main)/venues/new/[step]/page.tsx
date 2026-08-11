import { notFound } from "next/navigation";
import { VenueWizard } from "@/features/venue/create/VenueWizard";
import { venueSteps, type VenueStep } from "@/features/venue/create/venue-draft";

export function generateStaticParams() {
  return venueSteps.map(({ slug }) => ({ step: slug }));
}

export default async function NewVenueStepPage({ params }: { params: Promise<{ step: string }> }) {
  const { step } = await params;
  if (!venueSteps.some((item) => item.slug === step)) notFound();
  return <VenueWizard step={step as VenueStep} />;
}
