"use client";

import { Bell, Check, EyeOff, MoreHorizontal, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { notificationApi, type Notification, type NotificationPage } from "@/lib/notification-api";

const buttonStyle = "rounded-lg px-3 py-2 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087f58] disabled:cursor-not-allowed disabled:opacity-45";

function relativeTime(value: string, now: number) {
  const seconds = Math.max(0, Math.floor((now - Date.parse(value)) / 1000));
  if (!Number.isFinite(seconds)) return "";
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hour${seconds >= 7200 ? "s" : ""} ago`;
  return `${Math.floor(seconds / 86400)} day${seconds >= 172800 ? "s" : ""} ago`;
}

function Avatar({ notification }: { notification: Notification }) {
  const [failed, setFailed] = useState(false);
  const name = notification.actor?.name?.trim() || "Indoor";
  return <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e4f3eb] font-semibold text-[#087f58] sm:h-12 sm:w-12">
    {notification.actor?.avatar && !failed
      // eslint-disable-next-line @next/next/no-img-element
      ? <img src={notification.actor.avatar} alt="" className="h-full w-full object-cover" onError={() => setFailed(true)} />
      : name.charAt(0).toUpperCase()}
  </span>;
}

export function NotificationDropdown({ authenticated }: { authenticated: boolean }) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const bell = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const request = useRef<AbortController | null>(null);
  const alive = useRef(true);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"all" | "unread">("all");
  const [rows, setRows] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pagination, setPagination] = useState<NotificationPage["pagination"] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [menu, setMenu] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

  const load = useCallback(async (page: number, append = false) => {
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setLoading(true); setError(null);
    try {
      const result = await notificationApi.list(page, controller.signal);
      const collected = result.notifications;
      if (controller.signal.aborted || !alive.current) return;
      setRows(previous => Array.from(new Map((append ? [...previous, ...collected] : collected).map(row => [row.id, row])).values()));
      setUnreadCount(result.unreadCount); setPagination(result.pagination);
    } catch (cause) {
      if (!controller.signal.aborted && alive.current) setError(cause instanceof Error ? cause.message : "Unable to load notifications.");
    } finally {
      if (!controller.signal.aborted && alive.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    alive.current = true;
    const timer = authenticated ? window.setTimeout(() => void load(1), 0) : null;
    return () => { if (timer !== null) window.clearTimeout(timer); alive.current = false; request.current?.abort(); };
  }, [authenticated, load]);

  useEffect(() => {
    if (!open) return;
    const timer = window.setInterval(() => setNow(Date.now()), 30000);
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) { setOpen(false); setMenu(null); }
      else if (!(event.target as Element).closest("[data-notification-menu]")) setMenu(null);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      if (menu) {
        const trigger = Array.from(root.current?.querySelectorAll<HTMLButtonElement>("[data-menu-trigger]") ?? []).find(button => button.dataset.menuTrigger === menu);
        trigger?.focus(); setMenu(null);
      } else { setOpen(false); bell.current?.focus(); }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open, menu]);

  useEffect(() => { if (open) panel.current?.focus(); }, [open]);

  function changeTab(next: "all" | "unread") {
    if (tab === next) return;
    setTab(next); setRows([]); setPagination(null); setMenu(null); void load(1);
  }

  const visible = tab === "unread" ? rows.filter(row => !row.readAt) : rows;
  return <div ref={root} className="relative shrink-0">
    <button ref={bell} type="button" disabled={!authenticated} aria-label={unreadCount ? `Notifications, ${unreadCount} unread` : "Notifications"} aria-expanded={open} aria-haspopup="dialog" aria-controls={id}
      onClick={() => { setOpen(!open); setMenu(null); if (!open) { setNow(Date.now()); setPagination(null); setRows([]); void load(1); } }}
      className="relative flex h-11 w-11 items-center justify-center rounded-full text-[#26332d] transition hover:bg-[#f1f6f3] focus-visible:outline-2 focus-visible:outline-[#16b866] disabled:opacity-50">
      <Bell size={23} strokeWidth={1.8} />
      {authenticated && unreadCount > 0 && <span className="absolute right-0.5 top-0.5 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-[#ef233c] px-1 text-[10px] font-bold text-white">{unreadCount > 99 ? "99+" : unreadCount}</span>}
    </button>
    {open && authenticated && <div ref={panel} id={id} role="dialog" aria-label="Notifications" tabIndex={-1}
      onBlur={event => { if (event.relatedTarget && !root.current?.contains(event.relatedTarget as Node)) { setOpen(false); setMenu(null); } }}
      className="fixed left-3 right-3 top-[76px] z-[80] overflow-hidden rounded-2xl border border-[#e0e7e3] bg-white shadow-[0_12px_45px_rgba(24,39,31,0.2)] outline-none md:absolute md:left-auto md:right-0 md:top-[54px] md:w-[560px]">
      <div className="flex items-center justify-between gap-2 px-4 pt-5 sm:px-5">
        <h2 className="text-xl font-bold text-[#111713]">Notifications</h2>
        <button type="button" disabled title="Mark-read API is not available yet" className={`${buttonStyle} text-[#087f58]`}>Mark all as read</button>
      </div>
      <div className="mt-3 flex gap-5 border-b border-[#e0e7e3] px-5" aria-label="Notification filters">
        {(["all", "unread"] as const).map(value => <button key={value} type="button" aria-pressed={tab === value} onClick={() => changeTab(value)} className={`border-b-2 px-2 py-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-[#087f58] ${tab === value ? "border-[#087f58] text-[#087f58]" : "border-transparent text-[#77827e]"}`}>{value === "all" ? "All" : `Unread (${unreadCount})`}</button>)}
      </div>
      <div className="max-h-[min(65dvh,480px)] overflow-y-auto overscroll-contain" aria-busy={loading}>
        {visible.map(notification => {
          const booking = notification.bookingRequest;
          const actionable = notification.type === "BOOKING_REQUESTED" && (!booking || booking.status === "PENDING");
          const status = booking?.status;
          return <div key={notification.id} className={`flex gap-3 border-b border-[#e5ebe7] px-4 py-5 sm:px-5 ${!notification.readAt ? "bg-[#effaf5]" : "bg-white"}`}>
            <Avatar key={notification.actor?.avatar ?? "fallback"} notification={notification} />
            <div className="min-w-0 flex-1 sm:grid sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-x-3">
              <div>
              <p className="truncate text-sm font-bold text-[#111713]">{notification.actor?.name?.trim() || "Indoor"}</p>
              <p className="line-clamp-2 text-sm text-[#47534d]">{notification.type === "BOOKING_REQUESTED" ? "wants to book your turf." : notification.message || notification.title}</p>
              <time dateTime={notification.createdAt} title={notification.createdAt} className="mt-1 block text-xs text-[#84918a]">{relativeTime(notification.createdAt, now)}</time>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 sm:mt-0 sm:self-center">
                {actionable ? <>
                  <button type="button" disabled title="Accept is not available yet" className={`${buttonStyle} bg-[#087f58] text-white hover:bg-[#066b49]`}>Accept</button>
                  <button type="button" disabled title="Decline is not available yet" className={`${buttonStyle} border border-[#087f58] text-[#087f58] hover:bg-[#e4f3eb]`}>Decline</button>
                </> : status && <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold ${status === "ACCEPTED" ? "bg-[#e1f5eb] text-[#338364]" : "bg-[#edf0ee] text-[#68716d]"}`}>
                  {status === "ACCEPTED" && <Check size={14} />}{status === "DECLINED" && <X size={14} />}
                  {status.charAt(0) + status.slice(1).toLowerCase()}
                </span>}
                <div className="relative ml-auto" data-notification-menu>
                  <button type="button" data-menu-trigger={notification.id} aria-label={`Options for notification from ${notification.actor?.name || "Indoor"}`} aria-expanded={menu === notification.id} aria-controls={`${id}-${notification.id}`} onClick={() => setMenu(menu === notification.id ? null : notification.id)} className="rounded-lg bg-[#edf0ee] p-2 text-[#47534d] hover:bg-[#dfe6e1] focus-visible:outline-2 focus-visible:outline-[#087f58]"><MoreHorizontal size={18} /></button>
                </div>
              </div>
                  {menu === notification.id && <div id={`${id}-${notification.id}`} data-notification-menu aria-label="Notification options" className="mt-3 w-full rounded-xl border border-[#e0e7e3] bg-white p-2 shadow-lg sm:col-span-2">
                    <button type="button" disabled title="Hide notification API is not available yet" className="flex w-full items-center gap-2 rounded-lg p-3 text-left text-xs text-[#47534d] disabled:cursor-not-allowed disabled:opacity-50"><EyeOff size={16} />Hide notification</button>
                    <button type="button" disabled title="Delete notification API is not available yet" className="flex w-full items-center gap-2 rounded-lg p-3 text-left text-xs text-red-600 disabled:cursor-not-allowed disabled:opacity-50"><Trash2 size={16} />Delete notification</button>
                    <p className="px-3 pb-2 text-xs text-[#77827e]">These actions are not available yet.</p>
                  </div>}
            </div>
          </div>;
        })}
        {loading && <p role="status" className="px-5 py-8 text-center text-sm text-[#77827e]">Loading notifications…</p>}
        {error && <div role="alert" className="px-5 py-6 text-center text-sm text-red-600"><p>{error}</p><button type="button" onClick={() => void load(pagination ? pagination.page + 1 : 1, !!pagination)} className={`${buttonStyle} mt-2 text-[#087f58]`}>Retry</button></div>}
        {!loading && !error && visible.length === 0 && <p className="px-5 py-10 text-center text-sm text-[#77827e]">{tab === "unread" ? pagination?.hasNextPage ? "No unread notifications on the loaded pages." : "You have no unread notifications." : "No notifications yet."}</p>}
        {!loading && !error && pagination?.hasNextPage && <div className="p-3 text-center"><button type="button" onClick={() => void load(pagination.page + 1, true)} className={`${buttonStyle} text-[#087f58]`}>Load more</button></div>}
      </div>
    </div>}
  </div>;
}
