"use client";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { games } from "@/utils/data/games";
import { GameCard } from "./GameCard";

export function DiscoverGamesSection() {

  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: -1 | 1) => carouselRef.current?.scrollBy({ left: direction * 340, behavior: "smooth" });

  return (
    <section className="bg-[#f1f4f2] px-4 pb-10 sm:px-6 lg:px-10 lg:pb-14">
      <div className="mx-auto w-full max-w-[1440px] rounded-[24px] bg-white px-4 py-7 sm:px-7 sm:py-9 lg:px-12 lg:py-12">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-[22px] font-bold text-[#35413b] sm:text-[25px]">Discover Games</h2>
          <Link href="/games" target="_blank" className="flex items-center gap-1 text-[13px] font-bold uppercase text-[#00af5d] hover:text-[#008f4c] sm:text-[15px]">See all games <ChevronRight size={21} />
          </Link>
        </div>
        <div ref={carouselRef} className="mt-7 grid grid-cols-1 gap-5 pb-5 sm:flex sm:overflow-x-auto sm:scroll-smooth sm:[scrollbar-width:none] sm:[&::-webkit-scrollbar]:hidden">{games.map((game) => <GameCard key={game.id} game={game} />)}</div>
        <div className="mt-2 hidden justify-center gap-3 sm:flex">
          <button onClick={() => scroll(-1)} aria-label="Previous games" className="flex h-11 w-11 items-center justify-center 
          rounded-full bg-white text-[#35413b] shadow-[0_5px_15px_rgba(35,49,42,0.13)] hover:bg-[#f5f7f6] ">
            <ChevronLeft size={26} />
          </button>
          <button onClick={() => scroll(1)} aria-label="Next games" className="flex h-11 w-11 items-center justify-center 
          rounded-full bg-white text-[#35413b] shadow-[0_5px_15px_rgba(35,49,42,0.13)] hover:bg-[#f5f7f6] ">
            <ChevronRight size={26} />
          </button>
        </div>
      </div>
    </section>
  );
}
