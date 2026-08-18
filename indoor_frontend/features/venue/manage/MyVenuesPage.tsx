"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarDays, Clock3, Eye, ImageIcon, MapPin, Pencil, Plus, RefreshCw, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/features/auth/AuthProvider";
import { venueApi, type ApiVenue } from "@/lib/venue-api";

const PAGE_SIZE = 4;
const PLACEHOLDER_IMAGE = "/images/venues/1.png";
const tabs = ["All Venues", "Active", "Pending", "Inactive", "Rejected"] as const;
type Tab = (typeof tabs)[number];
type VenueStatus = Exclude<Tab, "All Venues">;

function venueStatus(value?: string | null): VenueStatus | null {
  const normalized = value?.trim().toLowerCase();
  if (!normalized) return null;
  if (normalized.includes("reject")) return "Rejected";
  if (normalized.includes("pending") || normalized.includes("review") || normalized.includes("approval")) return "Pending";
  if (normalized.includes("inactive") || normalized.includes("closed") || normalized.includes("disabled")) return "Inactive";
  if (normalized === "active" || normalized.includes("approved") || normalized.includes("published")) return "Active";
  return null;
}

function formatDate(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function AuthRedirect() {
  const router = useRouter();
  useEffect(() => {
    sessionStorage.setItem("indoor:open-login", "1");
    sessionStorage.setItem("indoor:login-return", "/my-venues");
    router.replace("/");
  }, [router]);
  return <PageMessage>Redirecting you to sign in…</PageMessage>;
}

export function MyVenuesPage() {
  const { user, loading: authLoading } = useAuth();
  const [venues, setVenues] = useState<ApiVenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("All Venues");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    if (authLoading || !user) return;
    const controller = new AbortController();
    venueApi.getMine(controller.signal)
      .then(({ venues: result }) => setVenues(result))
      .catch((reason) => { if (reason?.name !== "AbortError") setError(reason instanceof Error ? reason.message : "Unable to load your venues."); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [authLoading, reload, user]);

  const counts = useMemo(() => Object.fromEntries(tabs.map((item) => [item, item === "All Venues" ? venues.length : venues.filter((venue) => venueStatus(venue.businessStatus) === item).length])) as Record<Tab, number>, [venues]);
  const filtered = useMemo(() => tab === "All Venues" ? venues : venues.filter((venue) => venueStatus(venue.businessStatus) === tab), [tab, venues]);
  const displayed = filtered.slice(0, visible);
  const selectTab = (next: Tab) => { setTab(next); setVisible(PAGE_SIZE); };

  if (authLoading) return <MyVenuesSkeleton />;
  if (!user) return <AuthRedirect />;

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#f5f7f6] px-4 py-8 text-[#202b25] sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-[1280px]">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div><h1 className="text-3xl font-bold tracking-[-0.03em]">My Venues</h1><p className="mt-2 text-sm text-[#65736c] sm:text-base">Manage all the venues you&apos;ve listed on Indoor.</p></div>
          <Link href="/venues/new/basic-info" target="_blank" rel="noopener noreferrer" className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#08a958] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#078c4a]"><Plus size={18} /> Add New Venue</Link>
        </header>

        <div className="mt-7 overflow-x-auto rounded-xl border border-[#dfe6e2] bg-white p-3 shadow-[0_3px_15px_rgba(31,55,43,0.04)]">
          <div className="flex min-w-max gap-2" role="tablist" aria-label="Venue status">
            {tabs.map((item) => <button key={item} type="button" role="tab" aria-selected={tab === item} onClick={() => selectTab(item)} className={`flex min-w-[145px] items-center justify-center gap-3 rounded-lg px-5 py-3 text-sm font-medium transition ${tab === item ? "bg-[#eaf7f0] text-[#078d4a]" : "text-[#303b36] hover:bg-[#f6f8f7]"}`}>{item}<span className={`rounded-full px-2 py-0.5 text-xs ${tab === item ? "bg-[#0a9b52] text-white" : "bg-[#eaf4ee] text-[#198653]"}`}>{counts[item]}</span></button>)}
          </div>
        </div>

        {loading ? <VenueRowsSkeleton /> : error ? (
          <section className="mt-4 rounded-xl border border-red-200 bg-white px-6 py-14 text-center"><p className="font-semibold text-[#26332d]">We couldn&apos;t load your venues.</p><p className="mt-2 text-sm text-red-600">{error}</p><button type="button" onClick={() => { setLoading(true); setError(""); setReload((value) => value + 1); }} className="mt-5 inline-flex items-center gap-2 rounded-lg border border-[#bddfcb] px-4 py-2.5 text-sm font-semibold text-[#078d4a]"><RefreshCw size={16} /> Try again</button></section>
        ) : venues.length === 0 ? <EmptyState /> : filtered.length === 0 ? (
          <section className="mt-4 rounded-xl border border-[#dfe6e2] bg-white px-6 py-16 text-center"><p className="font-semibold">No {tab.toLowerCase()} venues</p><p className="mt-2 text-sm text-[#718078]">None of your venues currently match this status.</p></section>
        ) : (
          <section className="mt-4 overflow-hidden rounded-xl border border-[#dfe6e2] bg-white shadow-[0_4px_18px_rgba(31,55,43,0.04)]">
            {displayed.map((venue) => <VenueRow key={venue.id} venue={venue} />)}
            <div className="px-4 py-5 sm:px-6">
              {visible < filtered.length && <button type="button" onClick={() => setVisible((value) => value + PAGE_SIZE)} className="flex w-full items-center justify-center rounded-lg border border-[#9ed5b7] py-3 text-sm font-semibold text-[#078d4a] transition hover:bg-[#f0faf5]">Load More Venues</button>}
              <p className="mt-4 text-center text-sm text-[#65736c]">Showing {Math.min(visible, filtered.length)} of {filtered.length} {filtered.length === 1 ? "venue" : "venues"}</p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function VenueRow({ venue }: { venue: ApiVenue }) {
  const status = venueStatus(venue.businessStatus);
  const listed = formatDate(venue.createdAt);
  const location = [venue.area, venue.city].filter(Boolean).join(", ");
  return (
    <article className="border-b border-[#e5ebe8] p-4 last:border-b-0 sm:p-5 lg:flex lg:gap-6">
      <div className="relative h-44 w-full shrink-0 overflow-hidden rounded-lg bg-[#edf1ef] sm:h-48 lg:h-[150px] lg:w-[230px]"><Image unoptimized src={venue.photos?.[0]?.url || PLACEHOLDER_IMAGE} alt={venue.name} fill sizes="(max-width: 1024px) 100vw, 230px" className="object-cover" /><span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-xs text-white"><ImageIcon size={14} /> {venue.photos?.length ?? 0}</span></div>
      <div className="mt-4 min-w-0 flex-1 lg:mt-0">
        <div className="flex flex-wrap items-start justify-between gap-2"><div><h2 className="text-lg font-bold text-[#1f2b25]">{venue.name}</h2>{location && <p className="mt-1.5 flex items-center gap-1.5 text-sm text-[#68776f]"><MapPin size={15} /> {location}</p>}</div>{listed && <p className="text-xs text-[#68776f]">Listed on {listed}</p>}</div>
        <div className="mt-3 flex flex-wrap gap-2">{venue.venueType && <Badge>{venue.venueType}</Badge>}{status ? <Badge status={status}>{status}</Badge> : venue.businessStatus ? <Badge neutral>{venue.businessStatus}</Badge> : null}</div>
        <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-4">
          <Metric icon={<Star size={17} fill={venue.averageRating == null ? "none" : "#ffbb0b"} className={venue.averageRating == null ? "text-[#829088]" : "text-[#ffbb0b]"} />} value={venue.averageRating == null ? "No rating yet" : venue.averageRating.toFixed(1)} label={`${venue.reviewCount ?? 0} reviews`} />
          {venue.bookingMode && <Metric icon={<CalendarDays size={17} />} value={venue.bookingMode} label="Booking mode" />}
          {venue.minimumBookingMinutes != null && <Metric icon={<Clock3 size={17} />} value={`${venue.minimumBookingMinutes} mins`} label="Min booking" />}
          {venue.maximumBookingMinutes != null && <Metric icon={<Clock3 size={17} />} value={`${venue.maximumBookingMinutes} mins`} label="Max booking" />}
        </div>
        <div className="mt-5 flex flex-wrap gap-3 lg:justify-end"><Link href={`/venues/${venue.id}`} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#d7dfdb] px-4 py-2.5 text-sm font-medium hover:bg-[#f7f9f8] sm:flex-none"><Eye size={16} /> View Venue</Link><Link href={`/venues/${venue.id}/edit`} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#9fd5b8] px-4 py-2.5 text-sm font-medium text-[#078d4a] hover:bg-[#f0faf5] sm:flex-none"><Pencil size={16} /> Edit</Link></div>
      </div>
    </article>
  );
}

function Metric({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) { return <div className="flex min-w-0 gap-2 text-[#65736c]">{icon}<div className="min-w-0"><p className="break-words text-sm font-semibold text-[#29362f]">{value}</p><p className="mt-0.5 text-xs">{label}</p></div></div>; }
function Badge({ children, status, neutral = false }: { children: React.ReactNode; status?: VenueStatus; neutral?: boolean }) { const colors = neutral ? "bg-gray-100 text-gray-600" : status === "Rejected" ? "bg-red-50 text-red-700" : status === "Pending" ? "bg-amber-50 text-amber-700" : status === "Inactive" ? "bg-gray-100 text-gray-600" : "bg-[#e4f7ec] text-[#078647]"; return <span className={`rounded-full px-3 py-1 text-xs font-medium ${colors}`}>{children}</span>; }
function EmptyState() { return <section className="mt-4 rounded-xl border border-[#dfe6e2] bg-white px-6 py-16 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eaf7f0] text-[#089b52]"><MapPin size={25} /></div><h2 className="mt-5 text-lg font-bold">You haven&apos;t listed any venues yet.</h2><p className="mx-auto mt-2 max-w-md text-sm text-[#718078]">Create your first venue listing and start welcoming bookings.</p><Link href="/venues/new/basic-info" target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#08a958] px-5 py-3 text-sm font-semibold text-white"><Plus size={17} /> Add New Venue</Link></section>; }
function PageMessage({ children }: { children: React.ReactNode }) { return <main className="flex min-h-[60vh] items-center justify-center bg-[#f5f7f6] text-sm text-[#65736c]">{children}</main>; }
function MyVenuesSkeleton() { return <main className="min-h-[70vh] bg-[#f5f7f6] px-4 py-10"><div className="mx-auto max-w-[1280px] animate-pulse"><div className="h-9 w-48 rounded bg-[#e1e7e4]"/><div className="mt-3 h-4 w-80 max-w-full rounded bg-[#e1e7e4]"/><div className="mt-8 h-16 rounded-xl bg-white"/><VenueRowsSkeleton /></div></main>; }
function VenueRowsSkeleton() { return <div className="mt-4 space-y-px overflow-hidden rounded-xl border border-[#e1e7e4] bg-white">{Array.from({ length: 4 }, (_, index) => <div key={index} className="flex animate-pulse gap-5 p-5"><div className="h-32 w-44 shrink-0 rounded-lg bg-[#e5ebe8]"/><div className="flex-1"><div className="h-5 w-1/3 rounded bg-[#e5ebe8]"/><div className="mt-4 h-4 w-1/4 rounded bg-[#e5ebe8]"/><div className="mt-8 h-9 w-3/4 rounded bg-[#eef2f0]"/></div></div>)}</div>; }
