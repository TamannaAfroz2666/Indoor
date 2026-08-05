import { Venue } from "@/features/types/venue-search.types";
import {
  CircleCheck,
  Clock3,
  MapPin,
  Trophy,
} from "lucide-react";

type VenueInformationProps = {
  venue: Venue;
};

export default function VenueInformation({
  venue,
}: VenueInformationProps) {
  return (
    <div className="space-y-5">
      <section className="rounded-[16px] border border-[#e0e7e3] bg-white p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <Clock3 size={21} className="text-[#00a85a]" />
          <h2 className="text-[18px] font-bold text-[#17241e]">
            Timing
          </h2>
        </div>

        <p className="mt-3 text-[14px] text-[#48554e]">
          {venue.openingHours}
        </p>
      </section>

      <section className="rounded-[16px] border border-[#e0e7e3] bg-white p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <MapPin size={21} className="text-[#00a85a]" />
          <h2 className="text-[18px] font-bold text-[#17241e]">
            Location
          </h2>
        </div>

        <p className="mt-3 text-[14px] leading-6 text-[#48554e]">
          {venue.address}
        </p>

        {venue.mapEmbedUrl ? (
          <div className="mt-4 overflow-hidden rounded-[12px] border border-[#e2e8e4]">
            <iframe
              src={venue.mapEmbedUrl}
              title={`${venue.name} location`}
              width="100%"
              height="270"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block border-0"
            />
          </div>
        ) : null}
      </section>

      <section className="rounded-[16px] border border-[#e0e7e3] bg-white p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <Trophy size={21} className="text-[#00a85a]" />
          <h2 className="text-[18px] font-bold text-[#17241e]">
            Available sports
          </h2>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {venue.sports.map((sport) => (
            <div
              key={sport.id}
              className="flex items-center justify-between rounded-[11px] bg-[#f5f8f6] px-4 py-3"
            >
              <span className="text-[14px] font-semibold text-[#2a3730]">
                {sport.name}
              </span>

              <span className="text-[13px] font-bold text-[#009f57]">
                ৳{sport.pricePerHour.toLocaleString()}/hr
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[16px] border border-[#e0e7e3] bg-white p-5 sm:p-6">
        <h2 className="text-[18px] font-bold text-[#17241e]">
          Amenities
        </h2>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {venue.amenities.map((amenity) => (
            <div
              key={amenity}
              className="flex items-center gap-2 text-[14px] text-[#45534b]"
            >
              <CircleCheck size={18} className="text-[#00a85a]" />
              {amenity}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}