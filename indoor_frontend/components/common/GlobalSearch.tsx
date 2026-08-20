"use client";

import { Search } from "lucide-react";

export function GlobalSearch({ className = "" }: { className?: string }) {
  return (
    <form role="search" onSubmit={(event) => event.preventDefault()} className={`relative min-w-0 ${className}`}>
      <Search aria-hidden="true" size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#607068]" />
      <input
        type="search"
        aria-label="Search Indoor"
        placeholder="Search venues, bookings, players..."
        className="h-11 w-full rounded-lg border border-[#dce4e0] bg-white pl-10 pr-4 text-sm text-[#26332d] outline-none transition placeholder:text-[#8b9790] focus:border-[#16b866] focus:ring-2 focus:ring-[#16b866]/10"
      />
    </form>
  );
}
