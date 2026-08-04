import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { HeroCollage } from "./HeroCollage";
import { LocationSelector } from "./LocationSelector";
import { MainNavbar } from "@/components/common/MainNavbar";

export function HomeHero() {
  return (<> 
            <MainNavbar />

    <section className="rounded-b-[22px] bg-white">
      <div className="mx-auto grid min-h-[615px] w-full max-w-[1400px] items-center gap-14 px-6 pb-12 pt-8 md:px-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20 lg:pb-8 lg:pt-6">
        {/* Left content */}
        <div className="max-w-[520px]">
          <LocationSelector />

          <h1 className="mt-7 text-[32px] font-black uppercase leading-[1.08] tracking-[-1.2px] text-[#303b36] sm:text-[39px] lg:text-[31px] xl:text-[36px]">
            Book sports venues.
            <br />
            Join games.
            <br />
            Find trainers near you.
          </h1>

          <p className="mt-7 max-w-[500px] text-[17px] font-medium leading-7 text-[#738b81] sm:text-[18px]">
            Bangladesh&apos;s sports community to book venues, find trainers,
            and join games near you.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/venues"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#16b866] px-7 text-[15px] font-semibold text-white transition hover:bg-[#109a55]"
            >
              Explore venues
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/register"
              className="inline-flex h-12 items-center justify-center rounded-full border border-[#d8e1dc] px-7 text-[15px] font-semibold text-[#36433d] transition hover:border-[#16b866] hover:text-[#16b866]"
            >
              Register venue
            </Link>
          </div>
        </div>

        {/* Right image collage */}
        <HeroCollage />
      </div>
    </section>
 </> );
}