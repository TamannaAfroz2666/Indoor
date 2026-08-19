"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, Clock3, MapPin, MessageSquareText, Phone, Trophy, Users, WalletCards } from "lucide-react";
import { useAuth } from "@/features/auth/AuthProvider";
import { API_URL } from "@/lib/api-client";
import { bookingApi, type BookingDetails } from "@/lib/booking-api";
import { bookingCurrency, bookingDateFormat, bookingStatusStyle, bookingTimeFormat } from "./booking-display";

export function BookingDetailsPage({ bookingId }: { bookingId: string }) {
  const { user, loading: authLoading } = useAuth(); const router = useRouter();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true); const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      sessionStorage.setItem("indoor:open-login", "1"); sessionStorage.setItem("indoor:login-return", `/bookings/${bookingId}`); router.replace("/"); return;
    }
    const controller = new AbortController();
    bookingApi.getById(bookingId, controller.signal).then(({ booking: record }) => setBooking(record))
      .catch((cause) => { if (cause instanceof Error && cause.name !== "AbortError") setError(cause.message); })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [authLoading, bookingId, router, user]);

  if (authLoading || !user || loading) return <DetailsSkeleton />;
  if (error || !booking) {
    const missing = error === "Booking request not found";
    return <main className="mx-auto min-h-[60vh] max-w-2xl px-5 py-12"><div className="rounded-2xl border border-[#dce5e0] bg-white p-8 text-center"><h1 className="text-2xl font-bold">{missing ? "Booking request not found" : "Could not load booking request"}</h1><p className="mt-2 text-sm text-[#65756d]">{missing ? "This request does not exist or you do not have permission to view it." : error}</p><Link href="/bookings" className="mt-6 inline-flex rounded-lg bg-[#08ad59] px-5 py-3 text-sm font-bold text-white">Back to My Bookings</Link></div></main>;
  }

  const start = new Date(booking.startAt); const end = new Date(start.getTime() + booking.duration * 60000);
  const status = bookingStatusStyle[booking.status];
  const photo = booking.venue.photo || `${API_URL}/venues/${encodeURIComponent(booking.venue.id)}/thumbnail`;
  const address = [booking.venue.address1, booking.venue.address2, booking.venue.area, booking.venue.city].filter(Boolean).join(", ");
  return <main className="min-h-screen bg-[#f7f9f8] px-4 py-7 sm:px-6 lg:py-10"><div className="mx-auto max-w-[1200px]">
    <Link href="/bookings" className="inline-flex items-center gap-2 text-sm font-semibold text-[#526159] hover:text-[#078f4c]"><ArrowLeft size={17} /> Back to My Bookings</Link>
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-3xl font-bold text-[#1d2923]">Booking Request Details</h1><p className="mt-1 text-sm text-[#718078]">Latest information for request {booking.id}</p></div><span className={`rounded-full px-4 py-2 text-sm font-bold ring-1 ring-inset ${status.className}`}>{status.label}</span></div>
    <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,.75fr)]"><div className="space-y-6">
      <Section title="Booking Information"><div className="grid gap-5 sm:grid-cols-2"><Info label="Booking ID" value={booking.id} /><Info icon={Trophy} label="Sport" value={booking.space.sport} /><Info label="Court / Space" value={booking.space.name} /><Info icon={CalendarDays} label="Date" value={bookingDateFormat.format(start)} /><Info icon={Clock3} label="Start time" value={bookingTimeFormat.format(start)} /><Info icon={Clock3} label="End time" value={bookingTimeFormat.format(end)} /><Info label="Duration" value={`${booking.duration} minutes`} /><Info icon={Users} label="Participants" value={booking.participants ? `${booking.participants} players` : "Not specified"} /><Info icon={WalletCards} label="Hourly rate" value={`${bookingCurrency.format(booking.hourlyRate)} / hour`} /><Info icon={WalletCards} label="Estimated rate" value={bookingCurrency.format(booking.estimatedRate)} /><Info label="Requested" value={`${bookingDateFormat.format(new Date(booking.createdAt))}, ${bookingTimeFormat.format(new Date(booking.createdAt))}`} /><Info label="Last updated" value={`${bookingDateFormat.format(new Date(booking.updatedAt))}, ${bookingTimeFormat.format(new Date(booking.updatedAt))}`} /></div></Section>
      {booking.message && <Section title="Request Message"><div className="flex gap-3 rounded-xl bg-[#f6f9f7] p-4"><MessageSquareText className="shrink-0 text-[#08ad59]" size={20} /><p className="whitespace-pre-wrap text-sm leading-6 text-[#344139]">{booking.message}</p></div></Section>}
    </div><aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
      <section className="overflow-hidden rounded-2xl border border-[#dce5e0] bg-white"><div className="relative aspect-[16/9] bg-[#eaf0ed]"><Image src={photo} alt={booking.venue.name} fill unoptimized sizes="(max-width: 1024px) 100vw, 380px" className="object-cover" /></div><div className="p-5"><span className="rounded-full bg-[#eaf8f1] px-3 py-1 text-xs font-semibold text-[#078f4c]">{booking.venue.venueType}</span><h2 className="mt-3 text-xl font-bold">{booking.venue.name}</h2><p className="mt-2 flex items-start gap-2 text-sm leading-6 text-[#65756d]"><MapPin className="mt-0.5 shrink-0" size={16} /> {address}</p><Link href={`/venues/${booking.venue.id}`} className="mt-5 flex h-11 w-full items-center justify-center rounded-lg border border-[#b9d9c8] text-sm font-bold text-[#078f4c] hover:bg-[#effaf4]">View Venue</Link></div></section>
      <section className="rounded-2xl border border-[#bfe8d2] bg-white p-5"><Phone className="text-[#08ad59]" size={24} /><h2 className="mt-3 text-lg font-bold">Contact Venue</h2><p className="mt-1 text-sm text-[#65756d]">Contact is available because this request was successfully created.</p><p className="mt-4 break-all text-xl font-bold">{booking.venue.phone}</p><a href={`tel:${booking.venue.phone}`} className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#08ad59] text-sm font-bold text-white hover:bg-[#078f4c]"><Phone size={17} /> Call Now</a></section>
      <section className="rounded-2xl border border-[#dce5e0] bg-white p-5"><h2 className="font-bold">Request Status</h2><span className={`mt-3 inline-flex rounded-full px-3 py-1.5 text-xs font-bold ring-1 ring-inset ${status.className}`}>{status.label}</span><p className="mt-3 text-sm leading-6 text-[#65756d]">{statusText(booking.status)}</p></section>
    </aside></div>
  </div></main>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) { return <section className="rounded-2xl border border-[#dce5e0] bg-white p-5 sm:p-6"><h2 className="mb-5 text-xl font-bold text-[#1d2923]">{title}</h2>{children}</section>; }
function Info({ icon: Icon, label, value }: { icon?: typeof CalendarDays; label: string; value: string }) { return <div className="min-w-0"><p className="flex items-center gap-2 text-xs uppercase tracking-wide text-[#809087]">{Icon && <Icon size={15} />} {label}</p><p className="mt-1 break-words text-sm font-semibold text-[#26332d]">{value}</p></div>; }
function statusText(status: BookingDetails["status"]) { return ({ PENDING: "The venue is reviewing your request.", ACCEPTED: "The venue accepted this booking request.", DECLINED: "The venue declined this booking request.", CANCELLED: "This booking request was cancelled." })[status]; }
function DetailsSkeleton() { return <main className="min-h-screen bg-[#f7f9f8] px-5 py-10"><div className="mx-auto max-w-[1200px] animate-pulse"><div className="h-7 w-44 rounded bg-slate-200" /><div className="mt-6 h-10 w-80 max-w-full rounded bg-slate-200" /><div className="mt-7 grid gap-6 lg:grid-cols-[1.4fr_.75fr]"><div className="h-[520px] rounded-2xl border bg-white" /><div className="h-[420px] rounded-2xl border bg-white" /></div></div></main>; }
