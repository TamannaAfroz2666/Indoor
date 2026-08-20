"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/AuthProvider";
import { venueApi } from "@/lib/venue-api";

export function OwnerBookingsEntryPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const [hasNoVenues, setHasNoVenues] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      sessionStorage.setItem("indoor:open-login", "1");
      sessionStorage.setItem("indoor:login-return", "/owner/bookings");
      router.replace("/");
      return;
    }
    const controller = new AbortController();
    venueApi.getMine(controller.signal).then(({ venues }) => {
      if (!venues.length) { setHasNoVenues(true); return; }
      const target = [...venues].sort((a, b) =>
        (b._count?.bookingRequests ?? 0) - (a._count?.bookingRequests ?? 0) ||
        +new Date(b.createdAt) - +new Date(a.createdAt)
      )[0];
      router.replace(`/owner/venues/${target.id}/bookings`);
    }).catch((reason) => {
      if (reason?.name !== "AbortError") setError(reason instanceof Error ? reason.message : "Unable to load your venues.");
    });
    return () => controller.abort();
  }, [authLoading, router, user]);

  if (hasNoVenues) return <main className="flex min-h-[65vh] items-center justify-center bg-[#f7f9f8] p-4"><div className="max-w-md rounded-xl border border-[#dfe7e3] bg-white p-8 text-center text-[#26332d]"><CalendarDays className="mx-auto text-[#08a958]" /><h1 className="mt-4 text-xl font-bold">No venues yet</h1><p className="mt-2 text-sm text-[#68766f]">Create a venue before receiving booking requests.</p><Link href="/venues/new/basic-info" className="mt-5 inline-flex rounded-lg bg-[#08a958] px-5 py-3 text-sm font-semibold text-white">Add New Venue</Link></div></main>;
  if (error) return <main className="flex min-h-[65vh] items-center justify-center bg-[#f7f9f8] p-4 text-center text-red-700">{error}</main>;
  return <main className="flex min-h-[65vh] items-center justify-center bg-[#f7f9f8] text-sm text-[#68766f]">Opening your booking requests…</main>;
}
