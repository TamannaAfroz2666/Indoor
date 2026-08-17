"use client";

import { useMemo, useState, useEffect } from "react";
import { Search } from "lucide-react";
import { VenueListingCard } from "./VenueListingCard";
import { venueApi, toVenueCard } from "@/lib/venue-api";
import type { VenueCardData } from "@/features/types/venue-search.types";

type VenueTab = "venues" | "coaching" | "events" | "memberships";

const INITIAL_VISIBLE_COUNT = 12;
const LOAD_MORE_COUNT = 6;


export function VenuesListingPage() {


    const [activeTab, setActiveTab] = useState<VenueTab>("venues");
    const [searchText, setSearchText] = useState("");
    const [sport, setSport] = useState("all");
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
    const [venues, setVenues] = useState<VenueCardData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();
        venueApi.getAll(controller.signal)
            .then(({ venues: data }) => { setVenues(data.map(toVenueCard)); setError(""); })
            .catch((requestError) => { if (requestError.name !== "AbortError") setError(requestError.message || "Unable to load venues."); })
            .finally(() => { if (!controller.signal.aborted) setLoading(false); });
        return () => controller.abort();
    }, []);

    const filteredVenues = useMemo(() => {
        return venues.filter((venue) => {
            const matchesSearch = venue.name.toLowerCase().includes(searchText.toLowerCase());
            const matchesSport = sport === "all" || venue.sports?.some((item) => item.toLowerCase() === sport);

            return matchesSearch && matchesSport;
        });
    }, [searchText, sport, venues]);

    const visibleVenues = filteredVenues.slice(0, visibleCount);
    const hasMoreVenues = visibleCount < filteredVenues.length;

    function handleShowMore() {
        setVisibleCount((currentCount) =>
            Math.min(currentCount + LOAD_MORE_COUNT, filteredVenues.length),
        );
    }
    const tabs: { label: string; value: VenueTab; count: number }[] = [
        { label: "Venues", value: "venues", count: venues.length },
        // { label: "Coaching", value: "coaching", count: 51 },
        { label: "Events", value: "events", count: 26 },
        { label: "Memberships", value: "memberships", count: 27 },
    ];

    return (
        <div className="-mt-[70px] min-h-screen bg-[#f3f6f4] md:mt-0">
            <section className="border-b border-[#dce3df] bg-white">
                <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-6 py-7 lg:flex-row lg:items-center lg:justify-between lg:px-14">
                    <h1 className="text-[22px] font-bold text-[#111714]">
                        Sports Venues in Dhaka: Discover and Book Nearby Venues
                    </h1>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <div className="relative w-full sm:w-[230px]">
                            <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#728179]" />

                            <input
                                type="search"
                                value={searchText}
                                onChange={(event) => { setSearchText(event.target.value); setVisibleCount(INITIAL_VISIBLE_COUNT); }}
                                placeholder="Search by venue name"
                                className="h-[38px] w-full rounded-[7px] border border-[#d8e1dc] bg-white pl-10 pr-3 text-[14px] text-[#26312c] outline-none focus:border-[#04b963]"
                            />
                        </div>

                        <select
                            value={sport}
                            onChange={(event) => { setSport(event.target.value); setVisibleCount(INITIAL_VISIBLE_COUNT); }}
                            aria-label="Filter by sport"
                            className="h-[38px] w-full rounded-[7px] border border-[#d8e1dc] bg-white px-4 text-[14px] text-[#26312c] outline-none focus:border-[#04b963] sm:w-[230px]"
                        >
                            <option value="all">All Sports</option>
                            <option value="football">Football</option>
                            <option value="badminton">Badminton</option>
                            <option value="cricket">Cricket</option>
                        </select>
                    </div>
                </div>
            </section>

            <div className="sticky top-0 z-50 w-full border-b border-[#dce3df] bg-white shadow-[0_4px_10px_rgba(25,40,32,0.06)]">
                <div className="overflow-x-auto">
                    <div className="mx-auto flex w-full min-w-max max-w-[1600px] gap-9 px-6 lg:px-14">
                        {tabs.map((tab) => (
                            <button
                                key={tab.value}
                                type="button"
                                onClick={() => { setActiveTab(tab.value); setVisibleCount(INITIAL_VISIBLE_COUNT); }}
                                className={`shrink-0 border-b-[3px] px-1 py-4 text-[14px] font-medium transition ${activeTab === tab.value
                                        ? "border-[#06bd66] text-[#06ad5e]"
                                        : "border-transparent text-[#202923]"
                                    }`}
                            >
                                {tab.label} ({tab.count})
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <section className="mx-auto w-full max-w-[1600px] px-6 py-7 lg:px-14">
                {activeTab === "venues" ? (loading ? (
                    <div className="grid grid-cols-1 gap-x-9 gap-y-10 md:grid-cols-2 xl:grid-cols-3" aria-label="Loading venues">
                        {Array.from({ length: 6 }, (_, index) => <div key={index} className="h-[318px] animate-pulse rounded-[6px] bg-white shadow-[0_8px_18px_rgba(20,40,30,0.08)]"><div className="h-[210px] bg-[#e5ebe8]" /><div className="space-y-3 p-4"><div className="h-4 w-2/3 rounded bg-[#e5ebe8]" /><div className="h-3 w-1/2 rounded bg-[#edf1ef]" /></div></div>)}
                    </div>
                ) : error ? (
                    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl bg-white px-6 text-center"><p className="font-medium text-[#b04444]">Unable to load venues</p><p className="mt-2 text-sm text-[#6b7972]">{error}</p></div>
                ) : (
                    filteredVenues.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 gap-x-9 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
                                {visibleVenues.map((venue) => (
                                    <VenueListingCard key={venue.id} venue={venue} />
                                ))}
                            </div>
                            {hasMoreVenues && (
                                <div className="flex justify-center pb-4 pt-14">
                                    <button
                                        type="button"
                                        onClick={handleShowMore}
                                        className="min-w-[130px] rounded-[6px] bg-[#05bc66] px-6 py-3 text-[15px] font-semibold text-white shadow-[0_7px_16px_rgba(5,188,102,0.2)] transition hover:bg-[#04a95b] active:scale-[0.98]"
                                    >
                                        Show More
                                    </button>
                                </div>
                            )}
                        </>) : (
                        <div className="flex min-h-[300px] items-center justify-center rounded-xl bg-white">
                            <p className="text-[#6b7972]">No venues found.</p>
                        </div>
                    ))
                ) : (
                    <div className="flex min-h-[300px] items-center justify-center rounded-xl bg-white">
                        <p className="text-[#6b7972]">{activeTab} content will be available soon.</p>
                    </div>
                )}
            </section>
        </div>
    );
}
