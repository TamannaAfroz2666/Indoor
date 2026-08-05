import { Venue } from "@/features/types/venue-search.types";
import { Star } from "lucide-react";

type VenueHeaderProps = {
  venue: Venue;
};

export default function VenueHeader({ venue }: VenueHeaderProps) {
  return (
    <header>
      <div className="flex flex-wrap items-center gap-2 text-[13px] text-[#68736d]">
        <span>Venues</span>
        <span>/</span>
        <span>{venue.city}</span>
        <span>/</span>
        <span className="max-w-[220px] truncate text-[#2c3832]">
          {venue.name}
        </span>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-[27px] font-bold leading-tight text-[#18251f] sm:text-[32px]">
              {venue.name}
            </h1>

            {venue.featured ? (
              <span className="rounded-full bg-[#e6f8ee] px-3 py-1 text-[12px] font-semibold text-[#008b4b]">
                Featured
              </span>
            ) : null}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-[14px]">
            <span className="font-medium text-[#44514a]">{venue.area}</span>

            <span className="flex items-center gap-1 font-semibold text-[#29352f]">
              <Star
                size={17}
                className="fill-[#ffb800] text-[#ffb800]"
              />
              {venue.rating}
            </span>

            <span className="text-[#66736c]">
              ({venue.totalRatings} ratings)
            </span>

            <button
              type="button"
              className="font-semibold text-[#00a85a] underline underline-offset-4"
            >
              Rate venue
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}