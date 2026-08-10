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
import { LoginModal } from "@/features/modal/LoginModal";
import {
  clearRegistrationLoginPrefill,
  getRegistrationLoginPrefill,
  type LoginPrefill,
} from "@/lib/registration-login-prefill";
import type { ElementType } from "react";

type MobileNavItem =
  | {
    label: string;
    href: string;
    icon: React.ElementType;
    action?: never;
  }
  | {
    label: string;
    action: "login";
    icon: React.ElementType;
    href?: never;
  };

const mobileNavItems: MobileNavItem[] = [
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
    action: "login",
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


  const isVenueSection = pathname.startsWith("/venues"); // ADD: venue listing/details route

  const isBookingSection = pathname.startsWith("/bookings");

  const hideMobileTopHeader = pathname.startsWith("/venues")
  const isActiveRoute = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  };
  const [initialLoginPrefill] = useState(() =>
    pathname === "/" ? getRegistrationLoginPrefill() : null,
  );
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(
    () => initialLoginPrefill !== null,
  );
  const [loginPrefill, setLoginPrefill] = useState<LoginPrefill | null>(
    initialLoginPrefill,
  );

  useEffect(() => {
    if (initialLoginPrefill) clearRegistrationLoginPrefill();
  }, [initialLoginPrefill]);

  const openLogin = () => {
    setLoginPrefill(null);
    setIsLoginModalOpen(true);
  };

  const closeLogin = () => {
    setIsLoginModalOpen(false);
    setLoginPrefill(null);
  };

  return (
    <>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLogin}
        initialCredentials={loginPrefill}
      />
      {!hideMobileTopHeader && (
        <header className="fixed left-0 right-0 top-0 z-50 border-b border-gray-300 bg-white md:hidden">
          <div className="mx-auto flex h-[70px] w-full max-w-[430px] items-center justify-between px-6">
            <Logo />
            <LocationPicker />
          </div>
        </header>
      )}

      {/*     
        mobile-hidden
        md desktop navbar select 
      */}
      <div className="hidden md:block">
        {isVenueSection ? (
          <VenueDesktopNavbar
            onLogin={openLogin}
          />
        ) : isBookingSection ? (
          <BookDesktopNavbar
            pathname={pathname}
            onLogin={openLogin}
          />
        ) : (
          <HomeDesktopNavbar
            pathname={pathname}
            isActiveRoute={isActiveRoute}
            onLogin={openLogin}
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

            // ADD: Login item route নয়, তাই আলাদা active state
            const active =
              item.action === "login"
                ? isLoginModalOpen
                : isActiveRoute(item.href);

            // ADD: Login-এর জন্য button render হবে
            if (item.action === "login") {
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={openLogin}
                  className={`relative flex flex-col items-center justify-center gap-1 text-[12px] font-medium ${active ? "text-[#12b866]" : "text-[#303b36]"
                    }`}
                >
                  <Icon
                    size={21}
                    strokeWidth={active ? 2.2 : 1.7}
                  />

                  <span>{item.label}</span>

                  {active && (
                    <span className="absolute bottom-0 h-[2px] w-[48px] rounded-full bg-[#12b866]" />
                  )}
                </button>
              );
            }

            // Existing route items Link থাকবে
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`relative flex flex-col items-center justify-center gap-1 text-[12px] font-medium ${active ? "text-[#12b866]" : "text-[#303b36]"
                  }`}
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
  onLogin: () => void;
};

function HomeDesktopNavbar({
  pathname,
  isActiveRoute,
  onLogin
}: HomeDesktopNavbarProps) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // ADD
  return (<>
    {/* ADD: Login modal */}
    <LoginModal
      isOpen={isLoginModalOpen}
      onClose={() => setIsLoginModalOpen(false)}
    />
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

        <button
          type="button"
          onClick={onLogin}

          // onClick={() => setIsLoginModalOpen(true)}
          className="flex items-center gap-2.5 text-[16px]  font-mediumtext-[#303b36] transition-colors hover:text-[#16b866] "
        >
          <CircleUserRound size={27} strokeWidth={1.8} />
          <span>Login</span>
        </button>
      </div>
    </header>
  </>

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
  onLogin: () => void;
};

function BookDesktopNavbar({
  pathname,
  onLogin
}: BookDesktopNavbarProps) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // ADD

  return (<>
    <LoginModal
      isOpen={isLoginModalOpen}
      onClose={() => setIsLoginModalOpen(false)}
    />
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

          <button
            type="button"
            // onClick={() => setIsLoginModalOpen(true)}
            onClick={onLogin}
            className="flex items-center gap-2.5 text-[16px]  font-mediumtext-[#303b36] transition-colors hover:text-[#16b866] "
          >
            <CircleUserRound size={27} strokeWidth={1.8} />
            <span>Login</span>
          </button>
        </div>
      </div>
    </header>
  </>);
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

// venue navbar 

type VenueDesktopNavbarProps = {
  onLogin: () => void;
};

function VenueDesktopNavbar({ onLogin }: VenueDesktopNavbarProps) {
  return (
    <header className="sticky top-0 z-50 hidden border-b border-[#dce2df] bg-white md:block">
      <div className="mx-auto flex h-[80px] w-full max-w-[1600px] items-center px-8 lg:px-14">
        <Logo />

        <div className="ml-auto flex items-center gap-7">
          <div className="relative">
            <MapPin size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#26332d]" />

            <select
              defaultValue="dhaka"
              aria-label="Select location"
              className="h-[39px] w-[215px] appearance-none rounded-[7px] border border-[#d8dfdc] bg-white pl-10 pr-4 text-[14px] font-medium text-[#1f2924] outline-none"
            >
              <option value="dhaka">Dhaka</option>
              <option value="chattogram">Chattogram</option>
              <option value="sylhet">Sylhet</option>
            </select>
          </div>

          {/* <button type="button" className="h-[38px] rounded-[5px] bg-[#05bc66] px-5 text-[14px] font-semibold text-white">
            Get the App
          </button> */}

          <nav className="flex h-full items-center gap-8">
            <Link href="/games" className="text-[13px] font-semibold uppercase text-[#111713]">
              Play
            </Link>

            <Link href="/venues" className="flex h-[80px] items-center border-b-[3px] border-[#05b960] px-2 text-[13px] font-semibold uppercase text-[#111713]">
              Book
            </Link>

            <Link href="/trainers" className="text-[13px] font-semibold uppercase text-[#111713]">
              Train
            </Link>
          </nav>

          <button type="button" onClick={onLogin} className="flex items-center gap-3 text-[17px] font-medium text-[#222b27]">
            <CircleUserRound size={26} strokeWidth={1.8} />
            <span>Login</span>
          </button>
        </div>
      </div>
    </header>
  );
}

