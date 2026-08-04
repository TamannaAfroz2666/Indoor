"use client";
import { useState } from 'react'
import { CalendarDays, ChevronDown, MapPin, Search } from "lucide-react";
import { VenueTypeValue } from '@/features/types/venue-search.types';
import { venueTypeOptions } from '@/constants/venueTypeOptions';


function getTodayDate() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export default function SearchVanueCard() {

    const [venueType, setVenueType] = useState<VenueTypeValue>("turf");
    const [selectedDate, setSelectedDate] = useState(getTodayDate);
    const [location, setLocation] = useState("");


    return (
        <div className="rounded-[22px] border border-white/20 bg-black/35 px-2  text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:rounded-[28px] sm:px-7 sm:py-7">
            <h2 className="text-center text-[27px] font-bold leading-tight sm:text-[34px] sm:leading-none">
                Find your venue
            </h2>

            <p className="mt-2 text-center text-[13px] leading-5 text-white/80 sm:mt-3 sm:text-[15px]">
                Type, location & date — then search
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:grid-cols-[125px_140px_minmax(130px,1fr)_52px] sm:items-center">
                <div className="relative w-full min-w-0">
                    <select
                        id="venue-type"
                        name="venueType"
                        value={venueType}
                        onChange={(event) => setVenueType(event.target.value as VenueTypeValue)}
                        aria-label="Select venue type"
                        className="h-[44px] w-full min-w-0 cursor-pointer appearance-none rounded-full border border-white/20 bg-white/10 px-4 pr-2 text-[14px] text-white outline-none backdrop-blur-md transition hover:bg-white/15 focus:border-white/50 sm:h-[46px] sm:text-[15px]"
                    >
                        {venueTypeOptions.map((option) => (
                            <option
                                key={option.value}
                                value={option.value}
                                className="bg-[#26312c] text-white"
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="relative min-w-0">
                    <input
                        id="venue-date"
                        name="date"
                        type="date"
                        value={selectedDate}
                        onChange={(event) => setSelectedDate(event.target.value)}
                        aria-label="Select booking date"
                        min={new Date().toISOString().split("T")[0]}
                        className="h-[44px] w-full min-w-0 cursor-pointer rounded-full border border-white/20 bg-white/10 px-4 pr-10 text-[13px] text-white outline-none backdrop-blur-md transition focus:border-white/50 sm:h-[46px] sm:px-4 sm:pr-10 sm:text-[14px]" />

                    <CalendarDays
                        size={17}
                        aria-hidden="true"
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white"
                    />
                </div>

                <div className="relative min-w-0">
                    <MapPin
                        size={17}
                        aria-hidden="true"
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/75"
                    />

                    <input
                        id="venue-location"
                        name="location"
                        type="text"
                        value={location}
                        onChange={(event) => setLocation(event.target.value)}
                        placeholder="Location"
                        autoComplete="address-level2"
                        className="h-[44px] w-full min-w-0 rounded-full border border-white/20 bg-white/10 pl-11 pr-4 text-[14px] text-white outline-none backdrop-blur-md transition placeholder:text-white/65 focus:border-white/50 sm:h-[46px] sm:pr-5 sm:text-[15px]"
                    />
                </div>

                <button
                    type="button"
                    className="flex h-[44px] w-full items-center justify-center rounded-full bg-white/15 transition hover:bg-[#16b866] sm:h-[46px] sm:w-[52px]"
                >
                    <Search size={21} />
                </button>
            </div>
        </div>
    )
}
