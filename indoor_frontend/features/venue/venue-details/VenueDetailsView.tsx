import { Venue } from "@/features/types/venue-search.types";
import VenueBookingPanel from "./VenueBookingPanel";
import VenueGallery from "./VenueGallery";
import VenueHeader from "./VenueHeader";
import VenueInformation from "./VenueInformation";

type VenueDetailsViewProps = {
  venue: Venue;
};

export default function VenueDetailsView({
  venue,
}: VenueDetailsViewProps) {
  return (
    <main className="min-h-screen bg-[#fbfcfb] pb-24">
      <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <VenueHeader venue={venue} />

        <div className="mt-8 grid gap-7 lg:grid-cols-[minmax(0,1.75fr)_minmax(340px,0.75fr)] xl:gap-8">
          <div className="min-w-0">
            <VenueGallery
              venueName={venue.name}
              images={venue.images}
            />

            <section className="mt-6 rounded-[16px] border border-[#e0e7e3] bg-white p-5 sm:p-6">
              <h2 className="text-[20px] font-bold text-[#17241e]">
                About this venue
              </h2>

              <p className="mt-3 text-[14px] leading-7 text-[#56625c]">
                {venue.description}
              </p>
            </section>

            <div className="mt-5 lg:hidden">
              <VenueBookingPanel venue={venue} />
            </div>

            <div className="mt-5">
              <VenueInformation venue={venue} />
            </div>
          </div>

          <div className="hidden lg:block">
            <VenueBookingPanel venue={venue} />
          </div>
        </div>
      </div>
    </main>
  );
}