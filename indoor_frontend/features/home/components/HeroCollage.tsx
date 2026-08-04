import Image from "next/image";
import SearchVanueCard from "@/features/venue/card/SearchVanueCard";

export function HeroCollage() {
  return (
    <div className="relative mx-auto w-full max-w-[700px]">

      <div className="relative h-[490px] overflow-hidden rounded-sm">
        <Image
          src="/images/10.png"
          alt="Sports venue"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black-400" />
        <div className="absolute inset-0 backdrop-blur-[1px]" />

        <div className="pointer-events-none absolute -left-[20px] -top-[40px] h-[170px] w-[85px] rounded-r-full border-[18px] border-white border-l-0" />
      </div>
      <div className=" absolute left-1/2 top-1/2 z-20 w-[88%] max-w-[560px] -translate-x-1/2 -translate-y-1/2 sm:w-[90%] " >
      <SearchVanueCard/>
      </div>
    </div>
  );
}