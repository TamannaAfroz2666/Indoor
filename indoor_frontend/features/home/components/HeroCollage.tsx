import Image from "next/image";
import { CircleDot } from "lucide-react";

import { CircularText } from "./CircularText";

export function HeroCollage() {
  return (
    <div className="relative mx-auto w-full max-w-[700px]">
      <CircularText />

      <div className="relative grid h-[490px] grid-cols-2 grid-rows-2 overflow-hidden rounded-sm">
        {/* Left large image */}
        <div className="relative row-span-2 min-h-[490px] overflow-hidden">
          <Image
            src="/images/home/1.jpg"
            alt="People playing basketball"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 350px"
            className="object-cover"
          />

          <div className="pointer-events-none absolute -left-[20px] -top-[40px] h-[170px] w-[85px] rounded-r-full border-[18px] border-white border-l-0" />
        </div>

        {/* Top-right image */}
        <div className="relative overflow-hidden">
          <Image
            src="/images/home/2.jpg"
            alt="Indoor badminton court"
            fill
            priority
            sizes="(max-width: 768px) 50vw, 350px"
            className="object-cover"
          />
        </div>

        {/* Bottom-right image */}
        <div className="relative overflow-hidden">
          <Image
            src="/images/home/3.jpg"
            alt="People playing football"
            fill
            priority
            sizes="(max-width: 768px) 50vw, 350px"
            className="object-cover"
          />
        </div>
      </div>

      {/* Center green icon */}
      <div className="absolute left-1/2 top-1/2 z-20 flex h-[96px] w-[96px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#06bd62] shadow-lg">
        <div className="relative flex h-[52px] w-[52px] items-center justify-center rounded-full border-[5px] border-white">
          <CircleDot
            size={20}
            strokeWidth={3}
            className="text-white"
          />
        </div>
      </div>
    </div>
  );
}