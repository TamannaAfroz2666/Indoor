import Image from "next/image";
import Link from "next/link";
import { CircleDot, Star } from "lucide-react";
import { VenueCardData } from "../types/venue-search.types";



type VenueListingCardProps = {
  venue: VenueCardData;
};

export function VenueListingCard({ venue }: VenueListingCardProps) {
  return (
    <Link href={`/venues/${venue.id}`} className="group overflow-hidden rounded-[6px] bg-white shadow-[0_8px_18px_rgba(20,40,30,0.12)] transition hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(20,40,30,0.17)]">
      <div className="relative h-[210px] overflow-hidden">
        <Image unoptimized src={venue.image} alt={venue.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" />

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between">
          {venue.featured ? (
            <span className="min-w-[100px] bg-[#ffc400] px-5 py-2 text-center text-[13px] font-medium text-[#262b28]">
              Featured
            </span>
          ) : (
            <span />
          )}

          {venue.bookable ? (
            <span className="min-w-[100px] bg-[#04bd67] px-5 py-2 text-center text-[13px] font-medium text-white">
              Bookable
            </span>
          ) : null}
        </div>
      </div>

      <div className="min-h-[108px] px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 flex-1 truncate text-[15px] font-semibold text-[#161d19]">
            {venue.name}
          </h3>

          {venue.rating === null ? <span className="shrink-0 text-[12px] text-[#84918a]">No rating</span> : <div className="flex shrink-0 items-center gap-1 text-[13px] text-[#45524c]">
            <Star size={17} fill="#ffb800" className="text-[#ffb800]" />
            <span>{venue.rating.toFixed(2)}</span>
            <span className="text-[#6c7872]">({venue.reviewCount ?? 0})</span>
          </div>}
        </div>

        <p className="mt-2 truncate text-[13px] text-[#66756d]">
          {venue.address || "Address not available"}{venue.distance === null ? "" : ` (~${venue.distance.toFixed(1)} km)`}
        </p>

        <div className="mt-4 flex items-center gap-2 text-[#33413a]">
          <CircleDot size={18} />

          {venue.extraSports ? (
            <span className="text-[12px]">+ {venue.extraSports} more</span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
