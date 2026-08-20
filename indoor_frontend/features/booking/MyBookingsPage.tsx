"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Clock3, MapPin, RefreshCw, Users, WalletCards, type LucideIcon } from "lucide-react";
import { useAuth } from "@/features/auth/AuthProvider";
import { API_URL } from "@/lib/api-client";
import { bookingApi, type BookingStatus, type MyBooking } from "@/lib/booking-api";
import { bookingCurrency, bookingDateFormat, bookingStatusStyle, bookingTimeFormat } from "./booking-display";

type Filter = "ALL" | BookingStatus;
const filters: Array<[Filter, string]> = [["ALL", "All"], ["PENDING", "Pending"], ["ACCEPTED", "Accepted"], ["DECLINED", "Declined"], ["CANCELLED", "Cancelled"]];

export function MyBookingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<MyBooking[]>([]);
  const [filter, setFilter] = useState<Filter>("ALL");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      sessionStorage.setItem("indoor:open-login", "1");
      sessionStorage.setItem("indoor:login-return", "/bookings");
      router.replace("/");
      return;
    }
    const controller = new AbortController();
    bookingApi.getMine(controller.signal)
      .then(({ bookings: records }) => { setBookings(records); setError(""); })
      .catch((cause) => { if (cause instanceof Error && cause.name !== "AbortError") setError(cause.message); })
      .finally(() => { if (!controller.signal.aborted) { setLoading(false); setRefreshing(false); } });
    return () => controller.abort();
  }, [authLoading, reload, router, user]);

  useEffect(() => {
    const refreshOnFocus = () => setReload((value) => value + 1);
    window.addEventListener("focus", refreshOnFocus);
    return () => window.removeEventListener("focus", refreshOnFocus);
  }, []);

  function refreshBookings() {
    setRefreshing(true);
    setReload((value) => value + 1);
  }

  const counts = useMemo(() => bookings.reduce<Record<Filter, number>>((all, booking) => {
    all.ALL += 1; all[booking.status] += 1; return all;
  }, { ALL: 0, PENDING: 0, ACCEPTED: 0, DECLINED: 0, CANCELLED: 0 }), [bookings]);
  const visible = filter === "ALL" ? bookings : bookings.filter((booking) => booking.status === filter);

  if (authLoading || !user) return <main className="flex min-h-[60vh] items-center justify-center text-sm text-[#65756d]">Checking your session…</main>;

  return <main className="min-h-screen bg-[#f7f9f8] px-4 py-8 sm:px-6 lg:py-10"><div className="mx-auto max-w-[1280px]">
    <div className="flex flex-wrap items-start justify-between gap-4"><div><h1 className="text-3xl font-bold text-[#1d2923]">My Booking Requests</h1><p className="mt-2 text-[#65756d]">Track every request and its latest venue response.</p></div><button type="button" onClick={refreshBookings} disabled={loading || refreshing} className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#b9d9c8] bg-white px-4 text-sm font-bold text-[#078f4c] transition hover:bg-[#effaf4] disabled:cursor-wait disabled:opacity-60"><RefreshCw size={17} className={refreshing ? "animate-spin" : ""} /> {refreshing ? "Refreshing…" : "Refresh"}</button></div>
    <div className="mt-7 overflow-x-auto rounded-xl border border-[#dce5e0] bg-white p-2 shadow-sm"><div className="flex min-w-max gap-2">{filters.map(([value, label]) => <button key={value} type="button" onClick={() => setFilter(value)} className={`flex min-w-[130px] items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition ${filter === value ? "bg-[#eaf8f1] text-[#078f4c]" : "text-[#445149] hover:bg-[#f5f8f6]"}`}>{label}<span className={`rounded-full px-2 py-0.5 text-xs ${filter === value ? "bg-[#08ad59] text-white" : "bg-[#edf3f0] text-[#347058]"}`}>{counts[value]}</span></button>)}</div></div>
    {loading && <div className="mt-6 space-y-4">{[1, 2].map((item) => <div key={item} className="h-52 animate-pulse rounded-2xl border bg-white" />)}</div>}
    {error && <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700"><p className="font-semibold">Could not load booking requests</p><p className="mt-1 text-sm">{error}</p><button onClick={refreshBookings} className="mt-3 text-sm font-bold underline">Try again</button></div>}
    {!loading && !error && !visible.length && <div className="mt-6 rounded-2xl border border-[#dce5e0] bg-white px-6 py-16 text-center"><CalendarDays className="mx-auto text-[#8da098]" size={38} /><h2 className="mt-4 text-xl font-bold">{bookings.length ? `No ${filter.toLowerCase()} requests` : "No booking requests yet"}</h2><p className="mt-2 text-sm text-[#718078]">{bookings.length ? "Choose another status to see your requests." : "Book a venue and your request will appear here."}</p>{!bookings.length && <Link href="/venues" className="mt-5 inline-flex rounded-lg bg-[#08ad59] px-5 py-3 text-sm font-bold text-white">Browse Venues</Link>}</div>}
    {!loading && !error && visible.length > 0 && <div className="mt-6 space-y-4">{visible.map((booking) => <BookingCard key={booking.id} booking={booking} />)}</div>}
  </div></main>;
}

function BookingCard({ booking }: { booking: MyBooking }) {
  const start = new Date(booking.startAt); const end = new Date(start.getTime() + booking.duration * 60000);
  const status = bookingStatusStyle[booking.status];
  const photo = booking.venue.photo || `${API_URL}/venues/${encodeURIComponent(booking.venue.id)}/thumbnail`;
  return <article className="overflow-hidden rounded-2xl border border-[#dce5e0] bg-white shadow-[0_4px_18px_rgba(30,55,42,.04)]"><div className="grid md:grid-cols-[250px_1fr]">
    <Link href={`/bookings/${booking.id}`} aria-label={`View booking details for ${booking.venue.name}`} className="relative min-h-48 bg-[#eaf0ed]"><Image src={photo} alt={booking.venue.name} fill unoptimized sizes="(max-width: 768px) 100vw, 250px" className="object-cover" /></Link>
    <div className="p-5 sm:p-6"><Link href={`/bookings/${booking.id}`} className="block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#08ad59]"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-xl font-bold text-[#1d2923]">{booking.venue.name}</h2><p className="mt-1 flex items-center gap-1.5 text-sm text-[#65756d]"><MapPin size={15} /> {booking.venue.area}, {booking.venue.city}</p><div className="mt-3 flex flex-wrap gap-2"><span className="rounded-full bg-[#eaf8f1] px-3 py-1 text-xs font-semibold text-[#078f4c]">{booking.venue.venueType}</span><span className="rounded-full bg-[#f0f4f2] px-3 py-1 text-xs font-semibold text-[#445149]">{booking.space.sport}</span></div></div><span className={`rounded-full px-3 py-1.5 text-xs font-bold ring-1 ring-inset ${status.className}`}>{status.label}</span></div>
      <div className="mt-5 grid gap-4 border-t border-[#edf1ef] pt-5 sm:grid-cols-2 xl:grid-cols-4"><Detail icon={CalendarDays} label="Booking date" value={bookingDateFormat.format(start)} /><Detail icon={Clock3} label="Time" value={`${bookingTimeFormat.format(start)} – ${bookingTimeFormat.format(end)}`} /><Detail icon={Users} label="Participants" value={booking.participants ? `${booking.participants} players` : "Not specified"} /><Detail icon={WalletCards} label="Estimated rate" value={bookingCurrency.format(booking.estimatedRate)} /></div></Link>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs uppercase tracking-wide text-[#809087]">Court / Space</p><p className="mt-1 font-semibold text-[#26332d]">{booking.space.name} · {booking.duration} minutes</p><p className="mt-2 text-xs text-[#718078]">Requested {bookingDateFormat.format(new Date(booking.createdAt))} at {bookingTimeFormat.format(new Date(booking.createdAt))}</p></div><div className="flex flex-col gap-2 sm:flex-row"><Link href={`/venues/${booking.venue.id}`} className="rounded-lg border border-[#b9d9c8] px-4 py-2.5 text-center text-sm font-bold text-[#078f4c] hover:bg-[#effaf4]">View Venue</Link><Link href={`/bookings/${booking.id}`} className="rounded-lg bg-[#08ad59] px-4 py-2.5 text-center text-sm font-bold text-white hover:bg-[#078f4c]">View Booking Details</Link></div></div>
    </div></div></article>;
}

function Detail({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return <div className="flex gap-3"><Icon className="mt-0.5 shrink-0 text-[#718078]" size={18} /><div><p className="text-xs text-[#718078]">{label}</p><p className="mt-1 text-sm font-semibold text-[#26332d]">{value}</p></div></div>;
}
