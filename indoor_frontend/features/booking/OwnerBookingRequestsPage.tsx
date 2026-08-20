"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CalendarDays, Check, ChevronDown, CircleX, Clock3, Filter, MapPin, Plus, RefreshCw, Users, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/features/auth/AuthProvider";
import { bookingApi, type BookingStatus, type OwnerBooking } from "@/lib/booking-api";
import { venueApi, type ApiVenue } from "@/lib/venue-api";

const PAGE_SIZE = 5;
const statuses = ["ALL", "PENDING", "ACCEPTED", "DECLINED", "CANCELLED"] as const;
type StatusFilter = (typeof statuses)[number];
const labels: Record<StatusFilter, string> = { ALL: "All Requests", PENDING: "Pending", ACCEPTED: "Accepted", DECLINED: "Declined", CANCELLED: "Cancelled" };

const dateTime = new Intl.DateTimeFormat("en-BD", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
const dateOnly = new Intl.DateTimeFormat("en-BD", { day: "2-digit", month: "short", year: "numeric" });
const timeOnly = new Intl.DateTimeFormat("en-BD", { hour: "2-digit", minute: "2-digit" });
const currency = new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 0 });
const endAt = (booking: OwnerBooking) => new Date(new Date(booking.startAt).getTime() + booking.duration * 60000);

export function OwnerBookingRequestsPage({ venueId }: { venueId: string }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [venues, setVenues] = useState<ApiVenue[]>([]);
  const [bookings, setBookings] = useState<OwnerBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<StatusFilter>("ALL");
  const [space, setSpace] = useState("ALL");
  const [date, setDate] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    if (authLoading || !user) return;
    const controller = new AbortController();
    Promise.all([venueApi.getMine(controller.signal), bookingApi.getForVenue(venueId, controller.signal)])
      .then(([owned, result]) => { setVenues(owned.venues); setBookings(result.bookings); })
      .catch((reason) => { if (reason?.name !== "AbortError") setError(reason instanceof Error ? reason.message : "Unable to load booking requests."); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [authLoading, reload, user, venueId]);

  useEffect(() => {
    if (!authLoading && !user) {
      sessionStorage.setItem("indoor:open-login", "1");
      sessionStorage.setItem("indoor:login-return", `/owner/venues/${venueId}/bookings`);
      router.replace("/");
    }
  }, [authLoading, router, user, venueId]);

  const venue = venues.find((item) => item.id === venueId);
  const counts = useMemo(() => Object.fromEntries(statuses.map((item) => [item, item === "ALL" ? bookings.length : bookings.filter((booking) => booking.status === item).length])) as Record<StatusFilter, number>, [bookings]);
  const spaces = useMemo(() => Array.from(new Map(bookings.map((booking) => [booking.space.id, booking.space])).values()), [bookings]);
  const filtered = useMemo(() => bookings.filter((booking) => (status === "ALL" || booking.status === status) && (space === "ALL" || booking.space.id === space) && (!date || booking.startAt.slice(0, 10) === date)), [bookings, date, space, status]);
  const upcoming = useMemo(() => bookings.filter((booking) => ["PENDING", "ACCEPTED"].includes(booking.status) && new Date(booking.startAt) >= new Date()).sort((a, b) => +new Date(a.startAt) - +new Date(b.startAt)).slice(0, 5), [bookings]);

  if (authLoading || loading) return <DashboardSkeleton />;
  if (!user) return null;
  if (error) return <State title={error.includes("Venue not found") ? "Venue not found" : error.includes("access") ? "Access denied" : "We couldn’t load booking requests"} detail={error} retry={() => { setLoading(true); setError(""); setReload((value) => value + 1); }} />;
  if (!venue) return <State title="Access denied" detail="This venue is not in your owned venues." />;

  return (
    <main className="min-h-screen bg-[#f7f9f8] text-[#17251e]">
      <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[310px_minmax(0,1fr)]">
        <aside className="border-b border-[#e1e8e4] bg-white p-4 sm:p-6 lg:min-h-screen lg:border-b-0 lg:border-r">
          <label className="text-xs font-semibold uppercase tracking-wide text-[#74827a]">Selected venue</label>
          <div className="relative mt-2"><select value={venueId} onChange={(event) => router.push(`/owner/venues/${event.target.value}/bookings`)} className="h-11 w-full appearance-none rounded-lg border border-[#dce4e0] bg-white px-3 pr-9 text-sm font-semibold outline-none focus:border-[#0aaa59]">{venues.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 top-3.5" size={16} /></div>
          <SidebarSection title="Upcoming Bookings"><div className="space-y-2">{upcoming.length ? upcoming.map((booking) => <Upcoming key={booking.id} booking={booking} />) : <p className="rounded-lg bg-[#f7f9f8] p-4 text-sm text-[#6d7a73]">No upcoming bookings.</p>}</div></SidebarSection>
          <SidebarSection title="Quick Stats"><div className="grid grid-cols-2 gap-2"><Stat label="Total Requests" value={counts.ALL} icon={<Clock3 />} /><Stat label="Accepted" value={counts.ACCEPTED} icon={<Check />} /><Stat label="Declined" value={counts.DECLINED} icon={<CircleX />} /><Stat label="Cancelled" value={counts.CANCELLED} icon={<X />} /></div></SidebarSection>
          <SidebarSection title="Quick Actions"><div className="space-y-2"><Link href="/venues/new/basic-info" className="flex items-center gap-3 rounded-lg border border-[#e0e7e3] px-3 py-3 text-sm font-semibold hover:bg-[#f4faf7]"><Plus size={17} /> Add New Venue</Link><Link href="/my-venues" className="flex items-center gap-3 rounded-lg border border-[#e0e7e3] px-3 py-3 text-sm font-semibold hover:bg-[#f4faf7]"><MapPin size={17} /> Manage Venues</Link></div></SidebarSection>
        </aside>

        <section className="min-w-0 p-4 sm:p-7 xl:p-9">
          <header className="flex flex-wrap items-start justify-between gap-4"><div><h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Booking Requests</h1><p className="mt-2 text-sm text-[#68766f]">Manage booking requests for {venue.name}.</p></div><button type="button" onClick={() => setFiltersOpen((value) => !value)} className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#dce4e0] bg-white px-4 text-sm font-semibold"><Filter size={17} /> Filter</button></header>
          {filtersOpen && <div className="mt-5 grid gap-3 rounded-xl border border-[#dfe7e3] bg-white p-4 sm:grid-cols-2"><select aria-label="Venue space" value={space} onChange={(event) => { setSpace(event.target.value); setVisible(PAGE_SIZE); }} className="h-10 rounded-lg border border-[#dce4e0] px-3 text-sm"><option value="ALL">All spaces</option>{spaces.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.sport}</option>)}</select><input aria-label="Booking date" type="date" value={date} onChange={(event) => { setDate(event.target.value); setVisible(PAGE_SIZE); }} className="relative h-10 rounded-lg border border-[#dce4e0] px-3 text-sm" /></div>}
          <div className="mt-6 overflow-x-auto border-b border-[#dfe7e3]"><div className="flex min-w-max gap-8" role="tablist">{statuses.map((item) => <button key={item} role="tab" aria-selected={status === item} onClick={() => { setStatus(item); setVisible(PAGE_SIZE); }} className={`border-b-2 px-1 pb-3 text-sm font-semibold ${status === item ? "border-[#08a958] text-[#078d4a]" : "border-transparent text-[#58675f]"}`}>{labels[item]} <span className="ml-1 rounded-full bg-[#edf3f0] px-2 py-0.5 text-xs">{counts[item]}</span></button>)}</div></div>

          {bookings.length === 0 ? <Empty title="No booking requests yet" detail="New requests for this venue will appear here." /> : filtered.length === 0 ? <Empty title="No matching requests" detail="Try changing the selected filters." /> : <>
            <div className="mt-4 hidden overflow-hidden rounded-xl border border-[#dfe7e3] bg-white xl:block"><div className="grid grid-cols-[1.35fr_1.2fr_.8fr_1.2fr_.7fr_.7fr_.65fr_1fr] gap-4 bg-[#fafbfa] px-5 py-4 text-xs font-semibold text-[#637169]"><span>Requester</span><span>Venue & Space</span><span>Sport</span><span>Date & Time</span><span>Players</span><span>Amount</span><span>Status</span><span>Action</span></div>{filtered.slice(0, visible).map((booking) => <DesktopRow key={booking.id} booking={booking} />)}</div>
            <div className="mt-4 space-y-3 xl:hidden">{filtered.slice(0, visible).map((booking) => <MobileCard key={booking.id} booking={booking} />)}</div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-[#637169]"><p>Showing 1 to {Math.min(visible, filtered.length)} of {filtered.length} requests</p>{visible < filtered.length && <button onClick={() => setVisible((value) => value + PAGE_SIZE)} className="rounded-lg border border-[#9ed5b7] px-5 py-2.5 font-semibold text-[#078d4a]">Load more</button>}</div>
          </>}
        </section>
      </div>
    </main>
  );
}

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) { return <section className="mt-6 rounded-xl border border-[#e0e7e3] p-4"><h2 className="mb-4 font-bold">{title}</h2>{children}</section>; }
function Stat({ label, value, icon }: { label: string; value: number; icon: React.ReactElement }) { return <div className="rounded-lg border border-[#e5ebe8] p-3"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e9f8f0] text-[#079950]">{icon}</div><p className="mt-2 text-xl font-bold">{value}</p><p className="text-[11px] text-[#65736c]">{label}</p></div>; }
function Upcoming({ booking }: { booking: OwnerBooking }) { return <div className="rounded-lg border border-[#e5ebe8] p-3"><div className="flex items-center justify-between gap-2"><span className="text-xs font-bold text-[#087f45]">{timeOnly.format(new Date(booking.startAt))}</span><Status status={booking.status} /></div><p className="mt-2 text-sm font-semibold">{booking.space.name}</p><p className="mt-1 text-xs text-[#6d7a73]">{booking.space.sport} · {booking.participants ?? "—"} players</p></div>; }
function Avatar({ booking }: { booking: OwnerBooking }) { return booking.user.avatar ? <Image unoptimized width={40} height={40} src={booking.user.avatar} alt="" className="h-10 w-10 rounded-full object-cover" /> : <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dff5e9] font-bold text-[#087e45]">{(booking.user.name || "G").slice(0, 1).toUpperCase()}</div>; }
function Requester({ booking }: { booking: OwnerBooking }) { return <div className="flex min-w-0 gap-3"><Avatar booking={booking} /><div className="min-w-0"><p className="truncate text-sm font-bold">{booking.user.name || "Guest"}</p>{booking.user.phone && <p className="mt-1 truncate text-xs text-[#607068]">{booking.user.phone}</p>}<p className="mt-1 text-xs text-[#77857e]">{dateTime.format(new Date(booking.createdAt))}</p></div></div>; }
function Status({ status }: { status: BookingStatus }) { const colors = status === "PENDING" ? "bg-amber-100 text-amber-700" : status === "ACCEPTED" ? "bg-emerald-100 text-emerald-700" : status === "DECLINED" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"; return <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${colors}`}>{status[0] + status.slice(1).toLowerCase()}</span>; }
function Actions({ booking }: { booking: OwnerBooking }) { return booking.status === "PENDING" ? <div className="flex gap-2"><button type="button" disabled title="Status API not available yet" className="rounded-lg border border-red-300 px-3 py-2 text-xs font-semibold text-red-600 disabled:opacity-65">Decline</button><button type="button" disabled title="Status API not available yet" className="rounded-lg bg-[#08a958] px-3 py-2 text-xs font-semibold text-white disabled:opacity-65">Accept</button></div> : <button type="button" onClick={() => alert(booking.message || "No message was included with this request.")} className="rounded-lg border border-[#a9dabe] px-3 py-2 text-xs font-semibold text-[#078d4a]">View Details</button>; }
function DesktopRow({ booking }: { booking: OwnerBooking }) { return <article className="grid grid-cols-[1.35fr_1.2fr_.8fr_1.2fr_.7fr_.7fr_.65fr_1fr] items-center gap-4 border-t border-[#e5ebe8] px-5 py-5"><Requester booking={booking} /><div><p className="text-sm font-bold">{booking.venue.name}</p><p className="mt-1 text-xs text-[#607068]">{booking.space.name}</p><span className="mt-2 inline-block rounded-full bg-[#e5f8ed] px-2 py-0.5 text-[10px] text-[#078647]">{booking.venue.venueType}</span></div><p className="text-sm">{booking.space.sport}</p><div className="text-sm"><p className="font-semibold">{dateOnly.format(new Date(booking.startAt))}</p><p className="mt-2 text-xs">{timeOnly.format(new Date(booking.startAt))} – {timeOnly.format(endAt(booking))}</p></div><div className="text-sm"><p className="flex items-center gap-1"><Users size={14} /> {booking.participants ?? "—"}</p><p className="mt-2 text-xs text-[#607068]">{booking.duration} mins</p></div><p className="text-sm font-bold">{currency.format(booking.estimatedRate)}</p><Status status={booking.status} /><Actions booking={booking} /></article>; }
function MobileCard({ booking }: { booking: OwnerBooking }) { return <article className="rounded-xl border border-[#dfe7e3] bg-white p-4"><div className="flex items-start justify-between gap-3"><Requester booking={booking} /><Status status={booking.status} /></div><div className="mt-4 grid grid-cols-2 gap-4 border-y border-[#edf1ef] py-4 text-sm"><div><p className="text-xs text-[#728078]">Venue & space</p><p className="mt-1 font-semibold">{booking.venue.name}</p><p className="text-xs">{booking.space.name} · {booking.space.sport}</p></div><div><p className="text-xs text-[#728078]">Date & time</p><p className="mt-1 font-semibold">{dateOnly.format(new Date(booking.startAt))}</p><p className="text-xs">{timeOnly.format(new Date(booking.startAt))} – {timeOnly.format(endAt(booking))}</p></div><div><p className="text-xs text-[#728078]">Players / duration</p><p className="mt-1 font-semibold">{booking.participants ?? "—"} / {booking.duration} mins</p></div><div><p className="text-xs text-[#728078]">Amount</p><p className="mt-1 font-bold">{currency.format(booking.estimatedRate)}</p></div></div><div className="mt-4 flex justify-end"><Actions booking={booking} /></div></article>; }
function Empty({ title, detail }: { title: string; detail: string }) { return <div className="mt-5 rounded-xl border border-[#dfe7e3] bg-white px-5 py-16 text-center"><CalendarDays className="mx-auto text-[#0aa558]" /><h2 className="mt-4 font-bold">{title}</h2><p className="mt-2 text-sm text-[#6b7972]">{detail}</p></div>; }
function State({ title, detail, retry }: { title: string; detail: string; retry?: () => void }) { return <main className="flex min-h-[65vh] items-center justify-center bg-[#f7f9f8] p-4"><div className="max-w-md rounded-xl border border-[#dfe7e3] bg-white p-8 text-center"><h1 className="text-xl font-bold text-[#24322b]">{title}</h1><p className="mt-2 text-sm text-[#69776f]">{detail}</p>{retry && <button onClick={retry} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#08a958] px-4 py-2.5 text-sm font-semibold text-white"><RefreshCw size={16} /> Try again</button>}</div></main>; }
function DashboardSkeleton() { return <main className="min-h-screen animate-pulse bg-[#f7f9f8] p-5 sm:p-8"><div className="mx-auto max-w-[1500px]"><div className="h-9 w-64 rounded bg-[#e1e8e4]"/><div className="mt-3 h-4 w-80 max-w-full rounded bg-[#e1e8e4]"/><div className="mt-10 h-14 rounded-xl bg-white"/><div className="mt-4 h-96 rounded-xl bg-white"/></div></main>; }
