import Image from "next/image";
import Link from "next/link";
import { CircleDot } from "lucide-react";
import { VenueCardData } from "@/features/types/venue-search.types";


type VenueCardProps = {
  venue: VenueCardData;
};

export function VenueCard({ venue }: VenueCardProps) {
  return (
    <Link href={`/venues/${venue.id}`} className="group block w-[280px] shrink-0 overflow-hidden rounded-[16px] border border-[#e0e5e2] bg-white p-2 shadow-[0_8px_18px_rgba(30,45,37,0.13)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(30,45,37,0.18)] sm:w-[315px]">
      <div className="relative h-[165px] overflow-hidden rounded-[11px]">
        <Image src={venue.image} alt={venue.name} fill sizes="415px" className="object-cover transition-transform duration-500 group-hover:scale-105" />

        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/65 to-transparent" />

        {venue.extraSports ? (
          <div className="absolute bottom-2 left-2 flex items-center gap-1.5 text-[12px] font-medium text-white">
            <CircleDot size={17} />
            <span>+ {venue.extraSports} more</span>
          </div>
        ) : null}

        {venue.featured ? (
          <span className="absolute bottom-1.5 right-1.5 rounded-[4px] bg-[#26303b] px-2 py-1 text-[12px] font-semibold uppercase tracking-[0.2px] text-white">Featured</span>
        ) : null}
      </div>

      <div className="px-1 pb-1 pt-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 flex-1 truncate text-[15px] font-bold text-[#18201c] sm:text-[16px]">{venue.name}</h3>

          <span className="shrink-0 rounded-[7px] bg-[#d9fae8] px-2 py-1 text-[13px] font-semibold text-[#08aa5e]">
            {venue.rating.toFixed(2)} <span className="text-[11px]">({venue.reviewCount})</span>
          </span>
        </div>

        <p className="mt-1.5 truncate text-[13px] font-medium text-[#82958b] sm:text-[14px]">
          {venue.address} <span>• (~{venue.distance.toFixed(2)} Kms)</span>
        </p>
      </div>
    </Link>
  );
}