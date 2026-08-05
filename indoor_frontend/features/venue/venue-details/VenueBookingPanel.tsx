"use client";

import { Venue } from "@/features/types/venue-search.types";
import {
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Share2,
} from "lucide-react";
import { useState } from "react";
// import type { Venue } from "@/types/venue";

type VenueBookingPanelProps = {
  venue: Venue;
};

export default function VenueBookingPanel({
  venue,
}: VenueBookingPanelProps) {
  const [selectedSportId, setSelectedSportId] = useState(
    venue.sports[0]?.id ?? "",
  );

  const selectedSport = venue.sports.find(
    (sport) => sport.id === selectedSportId,
  );

  const handleShare = async () => {
    const shareData = {
      title: venue.name,
      text: `Check out ${venue.name}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(window.location.href);
      alert("Venue link copied");
    } catch {
      // User cancelled share dialog.
    }
  };

  return (
    <aside className="lg:sticky lg:top-24">
      <div className="rounded-[18px] border border-[#dde5e1] bg-white p-4 shadow-[0_12px_36px_rgba(31,50,40,0.08)] sm:p-5">
        <button
          type="button"
          className="flex h-[50px] w-full items-center justify-center rounded-[10px] bg-[#00b864] text-[15px] font-bold text-white transition hover:bg-[#009f57]"
        >
          Book now
        </button>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleShare}
            className="flex h-[46px] items-center justify-center gap-2 rounded-[9px] border border-[#dce5e0] text-[14px] font-semibold text-[#26342d] transition hover:bg-[#f7faf8]"
          >
            <Share2 size={18} />
            Share
          </button>

          <button
            type="button"
            className="flex h-[46px] items-center justify-center gap-2 rounded-[9px] border border-[#00b864] text-[13px] font-semibold text-[#009f57] transition hover:bg-[#effbf5]"
          >
            <BriefcaseBusiness size={17} />
            Bulk booking
          </button>
        </div>

        <div className="mt-5 border-t border-[#e7ece9] pt-5">
          <label
            htmlFor="venue-sport"
            className="text-[13px] font-semibold text-[#344139]"
          >
            Select sport
          </label>

          <div className="relative mt-2">
            <select
              id="venue-sport"
              value={selectedSportId}
              onChange={(event) =>
                setSelectedSportId(event.target.value)
              }
              className="h-[48px] w-full appearance-none rounded-[9px] border border-[#dce5e0] bg-white px-4 pr-10 text-[14px] font-medium text-[#25322b] outline-none transition focus:border-[#00b864]"
            >
              {venue.sports.map((sport) => (
                <option key={sport.id} value={sport.id}>
                  {sport.name}
                </option>
              ))}
            </select>

            <ChevronDown
              size={18}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#647169]"
            />
          </div>

          <div className="mt-4 rounded-[12px] bg-[#f2f8f5] p-4">
            <p className="text-[12px] font-medium text-[#68766e]">
              Starting from
            </p>

            <p className="mt-1 text-[24px] font-bold text-[#17241e]">
              ৳{selectedSport?.pricePerHour.toLocaleString() ?? "0"}
              <span className="ml-1 text-[13px] font-medium text-[#69756f]">
                / hour
              </span>
            </p>
          </div>

          <div className="mt-5 space-y-3">
            <div className="flex items-center gap-3 text-[14px] text-[#445149]">
              <CalendarDays size={19} className="text-[#00a85a]" />
              Select your booking date
            </div>

            <div className="flex items-center gap-3 text-[14px] text-[#445149]">
              <Clock3 size={19} className="text-[#00a85a]" />
              Choose an available time slot
            </div>

            <div className="flex items-center gap-3 text-[14px] text-[#445149]">
              <Check size={19} className="text-[#00a85a]" />
              Confirm and complete booking
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}