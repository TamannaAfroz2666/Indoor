"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    BookOpen,
    CircleUserRound,
    Dumbbell,
    Home,
    MapPin,
    PersonStanding,
    LocateFixed,
    Search
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";


const mobileNavItems = [
    {
        label: "Home",
        href: "/",
        icon: Home,
    },
    {
        label: "Play",
        href: "/games",
        icon: PersonStanding,
    },
    {
        label: "Book",
        href: "/venues",
        icon: BookOpen,
    },
    {
        label: "Train",
        href: "/trainers",
        icon: Dumbbell,
    },
    {
        label: "Login",
        href: "/login",
        icon: CircleUserRound,
    },
];


const homeDesktopItems = [
    {
        label: "Play",
        href: "/games",
        icon: PersonStanding,
    },
    {
        label: "Book",
        href: "/venues",
        icon: BookOpen,
    },
    {
        label: "Train",
        href: "/trainers",
        icon: Dumbbell,
    },
];

export function MainNavbar() {
    const pathname = usePathname();


    const isBookSection =
        pathname.startsWith("/venues") ||
        pathname.startsWith("/bookings");


    const isActiveRoute = (href: string) => {
        if (href === "/") {
            return pathname === "/";
        }

        return pathname.startsWith(href);
    };

    return (
        <>
            <header className="fixed left-0 right-0 top-0 z-50 border-b border-gray-300 bg-white md:hidden">
                <div className="mx-auto flex h-[70px] w-full max-w-[430px] items-center justify-between px-6">
                    <Logo />

                   <LocationPicker />
                </div>
            </header>

            {/*     
        mobile-hidden
        md desktop navbar select 
      */}
            <div className="hidden md:block">
                {isBookSection ? (
                    <BookDesktopNavbar pathname={pathname} />
                ) : (
                    <HomeDesktopNavbar
                        pathname={pathname}
                        isActiveRoute={isActiveRoute}
                    />
                )}
            </div>

            {/*
        MOBILE BOTTOM NAVIGATION
        CHANGE:
        all main page are same।
        md:hidden thats why tablet/desktop- will be not present
      */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-300 bg-white md:hidden">
                <div className="mx-auto grid h-[68px] w-full max-w-[430px] grid-cols-5">
                    {mobileNavItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActiveRoute(item.href);

                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`relative flex flex-col items-center justify-center gap-1 text-[12px] font-medium ${active ? "text-[#12b866]" : "text-[#303b36]"}`}
                            >
                                <Icon
                                    size={21}
                                    strokeWidth={active ? 2.2 : 1.7}
                                />
                                <span>{item.label}</span>
                                {active && (
                                    <span className="absolute bottom-0 h-[2px] w-[48px] rounded-full bg-[#12b866]" />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}

/*

  Home, games, trainers, profile will show the same 
navigation 
*/
type HomeDesktopNavbarProps = {
    pathname: string;
    isActiveRoute: (href: string) => boolean;
};

function HomeDesktopNavbar({
    pathname,
    isActiveRoute,
}: HomeDesktopNavbarProps) {
    return (
        <header className="sticky top-0 z-50 border-b border-gray-300 bg-white">
            <div className="mx-auto flex h-[70px] w-full max-w-[1400px] items-center justify-between px-8 lg:px-10">
                <Logo />

                <nav className="flex items-center gap-10 lg:gap-14">
                    {homeDesktopItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActiveRoute(item.href);

                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={` flex items-center gap-2.5 text-[16px] font-medium transition-colors ${active
                                    ? "text-[#16b866]"
                                    : "text-[#303b36] hover:text-[#16b866]"
                                    }`}
                            >
                                <Icon size={26} strokeWidth={1.8} />

                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <Link
                    href="/login"
                    className={` flex items-center gap-2.5 text-[16px] font-medium transition-colors ${pathname.startsWith("/login")
                        ? "text-[#16b866]"
                        : "text-[#303b36] hover:text-[#16b866]"
                        }
          `}
                >
                    <CircleUserRound size={27} strokeWidth={1.8} />

                    <span>Login</span>
                </Link>
            </div>
        </header>
    );
}

/*
  CHANGE:

   component:
  /venues
  /venues/[venueId]
  /bookings

  will show that route 

  
*/
type BookDesktopNavbarProps = {
    pathname: string;
};

function BookDesktopNavbar({
    pathname,
}: BookDesktopNavbarProps) {
    return (
        <header className="sticky top-0 z-50 border-b border-gray-300 bg-white">
            <div className="mx-auto flex h-[70px] w-full max-w-[1400px] items-center justify-between px-8 lg:px-10">
                <Logo />

                <div className="flex items-center gap-8">
                    <Link
                        href="/venues"
                        className={pathname.startsWith("/venues")
                            ? "font-semibold text-[#16b866]"
                            : "font-medium text-[#303b36]"
                        }
                    >
                        Venues
                    </Link>

                    <Link
                        href="/bookings"
                        className={
                            pathname.startsWith("/bookings")
                                ? "font-semibold text-[#16b866]"
                                : "font-medium text-[#303b36]"
                        }
                    >
                        My Bookings
                    </Link>

                    <Link
                        href="/login"
                        aria-label="Login"
                        className="text-[#303b36]"
                    >
                        <CircleUserRound size={28} strokeWidth={1.8} />
                    </Link>
                </div>
            </div>
        </header>
    );
}
// location function

const staticLocations = [
  "Dhaka",
  "Chattogram",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Rangpur",
];

function LocationPicker() {
  // CHANGE: বর্তমানে selected location এখানে থাকবে
  const [selectedLocation, setSelectedLocation] = useState("Dhaka");

  // CHANGE: dropdown open/close control
  const [isOpen, setIsOpen] = useState(false);

  // CHANGE: search field value
  const [searchTerm, setSearchTerm] = useState("");

  // CHANGE: dropdown-এর বাইরে click করলে close করার জন্য
  const pickerRef = useRef<HTMLDivElement>(null);

  // CHANGE: static list filter; পরে API result এখানে বসবে
  const filteredLocations = staticLocations.filter((location) =>
    location.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  function handleLocationSelect(location: string) {
    setSelectedLocation(location); // CHANGE: selected city update
    setSearchTerm(""); // CHANGE: search reset
    setIsOpen(false); // CHANGE: dropdown close
  }

  return (
    <div
      ref={pickerRef}
      className="relative"
    >
      {/* CHANGE:
          Native select না।
          এটি শুধু dropdown open করার trigger button।
      */}
      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className="
          flex
          h-[44px]
          w-[168px]
          items-center
          gap-3
          rounded-full
          border
          border-[#dde3e0]
          bg-[#f3f6f4]
          px-4
          text-left
          text-[14px]
          font-medium
          text-[#303b36]
          transition
          hover:border-[#cbd5d0]
          focus:border-[#16b866]
          focus:outline-none
        "
      >
        {/* CHANGE: তোমার code-এ className words একসাথে ছিল */}
        <MapPin
          size={18}
          strokeWidth={1.9}
          className="shrink-0 text-[#42514a]"
        />

        <span className="min-w-0 flex-1 truncate">
          {selectedLocation}
        </span>
      </button>

      {/* CHANGE: button click করলে screenshot-এর মতো search panel */}
      {isOpen && (
        <div
          className="
            absolute
            right-0
            top-[52px]
            z-[70]
            w-[290px]
            rounded-xl
            border
            border-[#e0e5e2]
            bg-white
            p-3
            shadow-[0_10px_30px_rgba(24,39,31,0.16)]
          "
        >
          {/* CHANGE: searchable input */}
          <div
            className="
              flex
              h-[48px]
              items-center
              gap-3
              rounded-lg
              border
              border-[#dce3df]
              bg-white
              px-4
              focus-within:border-[#16b866]
            "
          >
            <Search
              size={20}
              strokeWidth={1.9}
              className="shrink-0 text-[#41556a]"
            />

            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Select cities or places"
              autoFocus
              className="
                min-w-0
                flex-1
                bg-transparent
                text-[14px]
                text-[#303b36]
                outline-none
                placeholder:text-[#9aa3b4]
              "
            />

            {/* CHANGE:
                পরে browser geolocation/API logic এখানে connect করবে
            */}
            <button
              type="button"
              aria-label="Use current location"
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-full
                text-[#08b963]
                transition
                hover:bg-[#edf9f2]
              "
            >
              <LocateFixed size={20} strokeWidth={2} />
            </button>
          </div>

          {/* CHANGE: filtered location results */}
          <div className="mt-2 max-h-[220px] overflow-y-auto">
            {filteredLocations.length > 0 ? (
              filteredLocations.map((location) => (
                <button
                  key={location}
                  type="button"
                  onClick={() => handleLocationSelect(location)}
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-lg
                    px-3
                    py-3
                    text-left
                    text-[14px]
                    text-[#303b36]
                    transition
                    hover:bg-[#f2f6f4]
                  "
                >
                  <MapPin
                    size={17}
                    strokeWidth={1.8}
                    className="text-[#65736d]"
                  />

                  <span>{location}</span>
                </button>
              ))
            ) : (
              <p className="px-3 py-5 text-center text-sm text-gray-500">
                No location found
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

