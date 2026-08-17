"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Images } from "lucide-react";
import { useState } from "react";

type VenueGalleryProps = {
  venueName: string;
  images: string[];
};

export default function VenueGallery({
  venueName,
  images,
}: VenueGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const showPreviousImage = () => {
    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? images.length - 1 : currentIndex - 1,
    );
  };

  const showNextImage = () => {
    setActiveIndex((currentIndex) =>
      currentIndex === images.length - 1 ? 0 : currentIndex + 1,
    );
  };

  if (!images.length) {
    return (
      <div className="flex aspect-[16/9] items-center justify-center rounded-[18px] bg-[#edf1ef] text-[#647069]">
        No venue images available
      </div>
    );
  }

  return (
    <section>
      <div className="group relative aspect-[16/10] overflow-hidden rounded-[18px] bg-[#e9eeeb] sm:aspect-[16/9] lg:aspect-[16/8.8]">
        <Image
          unoptimized
          src={images[activeIndex]}
          alt={`${venueName} image ${activeIndex + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 68vw"
          className="object-cover transition duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/5" />

        {images.length > 1 ? (
          <>
            <button
              type="button"
              onClick={showPreviousImage}
              aria-label="Show previous image"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#18251f] shadow-md transition hover:bg-white sm:left-5 sm:h-11 sm:w-11"
            >
              <ChevronLeft size={22} />
            </button>

            <button
              type="button"
              onClick={showNextImage}
              aria-label="Show next image"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#18251f] shadow-md transition hover:bg-white sm:right-5 sm:h-11 sm:w-11"
            >
              <ChevronRight size={22} />
            </button>
          </>
        ) : null}

        <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-black/65 px-3 py-2 text-[12px] font-semibold text-white backdrop-blur-md">
          <Images size={15} />
          {activeIndex + 1} / {images.length}
        </div>

        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show image ${index + 1}`}
              className={`h-2 rounded-full transition-all ${
                activeIndex === index
                  ? "w-6 bg-white"
                  : "w-2 bg-white/65 hover:bg-white"
              }`}
            />
          ))}
        </div>
      </div>

      {images.length > 1 ? (
        <div className="mt-3 hidden grid-cols-4 gap-3 sm:grid">
          {images.slice(0, 4).map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative aspect-[16/10] overflow-hidden rounded-[10px] border-2 transition ${
                activeIndex === index
                  ? "border-[#00b864]"
                  : "border-transparent opacity-75 hover:opacity-100"
              }`}
            >
              <Image
                unoptimized
                src={image}
                alt={`${venueName} thumbnail ${index + 1}`}
                fill
                sizes="180px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}
