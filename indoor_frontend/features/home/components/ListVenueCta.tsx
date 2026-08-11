"use client";

import Link from "next/link";
import { Plus, Store } from "lucide-react";

import { useAuth } from "@/features/auth/AuthProvider";

export function ListVenueCta() {
  const { user, loading } = useAuth();

  if (loading || !user) return null;

  return (
    <section className="bg-[#f1f4f2] px-4 pb-10 sm:px-6 lg:px-10 lg:pb-14">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start gap-6 rounded-[24px] border border-[#dcefe3] bg-[#edf9f1] px-6 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12 lg:py-9">
        <div className="flex items-center gap-5 sm:gap-6">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-[#00af5d] shadow-[0_5px_18px_rgba(22,184,102,0.12)] sm:h-20 sm:w-20">
            <Store size={38} strokeWidth={1.7} aria-hidden="true" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#1f3b2d] sm:text-[24px]">
              List your venue on Indoor
            </h2>
            <p className="mt-1.5 text-sm leading-6 text-[#65756d] sm:text-base">
              Reach more players and grow your bookings.
            </p>
          </div>
        </div>

        <Link
          href="/venues/new"
          className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-[#00af5d] px-6 py-3.5 text-sm font-bold text-white shadow-[0_5px_14px_rgba(0,175,93,0.2)] transition hover:bg-[#008f4c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00af5d] sm:w-auto sm:text-base"
        >
          <Plus size={20} strokeWidth={2.2} aria-hidden="true" />
          <span>List Your Venue</span>
        </Link>
      </div>
    </section>
  );
}
