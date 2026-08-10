"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bookmark, CalendarDays, CircleUserRound, Gamepad2, LogOut, Settings, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/features/auth/AuthProvider";

const items = [
  { label: "My Bookings", href: "/bookings", icon: CalendarDays },
  { label: "My Games", href: "/my-games", icon: Gamepad2 },
  { label: "Joined Games", href: "/joined-games", icon: Users },
  { label: "Saved Venues", href: "/saved-venues", icon: Bookmark },
  { label: "Account Settings", href: "/account-settings", icon: Settings },
];

export function UserProfileMenu({ onLogin, mobile = false }: { onLogin: () => void; mobile?: boolean }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeOutside = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", closeOutside);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOutside);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  if (!user) {
    return (
      <button
        type="button"
        onClick={onLogin}
        disabled={loading}
        className={mobile
          ? "relative flex h-full w-full flex-col items-center justify-center gap-1 text-[12px] font-medium text-[#303b36] disabled:opacity-50"
          : "flex items-center gap-2.5 text-[16px] font-medium text-[#303b36] transition-colors hover:text-[#16b866] disabled:opacity-50"}
      >
        <CircleUserRound size={mobile ? 21 : 27} strokeWidth={1.8} />
        <span>{loading ? "Loading" : "Login"}</span>
      </button>
    );
  }

  const initials = (user.name || user.email || "User")
    .split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

  return (
    <div ref={rootRef} className={mobile ? "relative h-full w-full" : "relative"}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open profile menu"
        className={mobile
          ? "flex h-full w-full flex-col items-center justify-center gap-1 text-[12px] font-medium text-[#303b36]"
          : "flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-[#dbe5df] bg-[#e8f8f0] text-sm font-bold text-[#087d47] transition hover:border-[#16b866]"}
      >
        <span className={mobile ? "flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-[#e8f8f0] text-[10px] font-bold text-[#087d47]" : "contents"}>
          {user.avatar ? (
            <Image src={user.avatar} alt="Profile" width={40} height={40} unoptimized className="h-full w-full object-cover" />
          ) : initials}
        </span>
        {mobile && <span>Profile</span>}
      </button>

      {open && (
        <div role="menu" className={`absolute z-[120] w-[270px] overflow-hidden rounded-xl border border-[#dce4e0] bg-white py-2 text-left shadow-[0_14px_40px_rgba(24,39,31,0.2)] ${mobile ? "bottom-[62px] right-2" : "right-0 top-12"}`}>
          <div className="border-b border-[#edf1ef] px-4 py-3">
            <p className="truncate text-sm font-semibold text-[#202b25]">{user.name || "Indoor user"}</p>
            <p className="truncate text-xs text-[#738078]">{user.email}</p>
          </div>
          <div className="py-1">
            {items.map(({ label, href, icon: Icon }) => (
              <Link key={href} href={href} role="menuitem" onClick={() => setOpen(false)} className={`flex items-center gap-3 px-4 py-2.5 text-sm transition hover:bg-[#f2f7f4] ${pathname === href ? "font-semibold text-[#0b9e57]" : "text-[#303b36]"}`}>
                <Icon size={17} /><span>{label}</span>
              </Link>
            ))}
          </div>
          <div className="border-t border-[#edf1ef] pt-1">
            <button type="button" role="menuitem" onClick={async () => { setOpen(false); await logout(); router.push("/"); }} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-[#303b36] hover:bg-[#f2f7f4]">
              <LogOut size={17} /><span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
