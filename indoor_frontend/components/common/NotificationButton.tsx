"use client";

import { Bell } from "lucide-react";

export function NotificationButton({ unreadCount }: { unreadCount?: number }) {
  const count = typeof unreadCount === "number" && unreadCount > 0 ? unreadCount : 0;
  return (
    <button type="button" aria-label={count ? `Notifications, ${count} unread` : "Notifications"} className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#26332d] transition hover:bg-[#f1f6f3] focus:outline-none focus:ring-2 focus:ring-[#16b866]/30">
      <Bell size={23} strokeWidth={1.8} />
      {count > 0 && <span className="absolute right-0.5 top-0.5 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-[#08ad59] px-1 text-[10px] font-bold leading-none text-white">{count > 99 ? "99+" : count}</span>}
    </button>
  );
}
