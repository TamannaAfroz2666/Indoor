"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { VenueCard } from "./VenueCard";
import { venueApi, toVenueCard } from "@/lib/venue-api";
import type { VenueCardData } from "@/features/types/venue-search.types";

export function BookVenuesSection() {
    const carouselRef = useRef<HTMLDivElement>(null);
    const [homeVenues, setHomeVenues] = useState<VenueCardData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();
        venueApi.getAll(controller.signal)
            .then(({ venues }) => { setHomeVenues(venues.slice(0, 5).map(toVenueCard)); setError(""); })
            .catch((requestError) => { if (requestError.name !== "AbortError") setError("Venues are temporarily unavailable."); })
            .finally(() => { if (!controller.signal.aborted) setLoading(false); });
        return () => controller.abort();
    }, []);

    function scrollCarousel(direction: "left" | "right") {
        carouselRef.current?.scrollBy({
            left: direction === "left" ? -330 : 330,
            behavior: "smooth",
        });
    }
    return (
        <section className="bg-[#f1f4f2] px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
            <div className="mx-auto w-full max-w-[1440px] rounded-[24px] bg-white px-4 py-7 sm:px-7 sm:py-9 lg:px-12 lg:py-12">
                <div className="flex items-center justify-between gap-4">
                    <h2 className="text-[22px] font-bold text-[#35413b] sm:text-[25px]">Book Venues</h2>

                    <button
                        type="button"
                        onClick={() => window.open("/venues", "_blank", "noopener,noreferrer")}
                        className="flex items-center gap-1 text-[13px] font-bold uppercase text-[#00af5d] transition hover:text-[#008f4c] sm:text-[15px]"
                    >
                        <span>See all venues</span>
                        <ChevronRight size={21} strokeWidth={2} />
                    </button>
                </div>

                <div ref={carouselRef} className="mt-7 grid grid-cols-1 gap-5 pb-5 sm:flex sm:overflow-x-auto sm:scroll-smooth sm:[scrollbar-width:none] sm:[&::-webkit-scrollbar]:hidden">
                    {loading ? Array.from({ length: 4 }, (_, index) => <div key={index} className="h-[254px] w-full animate-pulse rounded-[16px] border border-[#e0e5e2] bg-[#edf1ef] sm:w-[315px] sm:shrink-0" />)
                        : error ? <div className="flex min-h-[180px] w-full items-center justify-center rounded-xl bg-[#f7f9f8] text-sm text-[#6b7972]">{error}</div>
                        : homeVenues.length ? homeVenues.map((venue) => <VenueCard key={venue.id} venue={venue} />)
                        : <div className="flex min-h-[180px] w-full items-center justify-center rounded-xl bg-[#f7f9f8] text-sm text-[#6b7972]">No venues are available yet.</div>}
                </div>

                <div className="mt-1 hidden items-center justify-center gap-3 sm:flex">
                    <button type="button" onClick={() => scrollCarousel("left")} aria-label="Previous venues" className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-white text-[#35413b] shadow-[0_5px_15px_rgba(35,49,42,0.12)] transition hover:bg-[#f5f7f6] ">
                        <ChevronLeft size={27} strokeWidth={1.7} />
                    </button>

                    <button type="button" onClick={() => scrollCarousel("right")} aria-label="Next venues" className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-white text-[#35413b] shadow-[0_5px_15px_rgba(35,49,42,0.12)] transition hover:bg-[#f5f7f6] ">
                        <ChevronRight size={27} strokeWidth={1.7} />
                    </button>
                </div>
            </div>
        </section>
    );
}
