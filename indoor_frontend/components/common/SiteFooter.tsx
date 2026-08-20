import Link from "next/link";
import { Logo } from "./Logo";

const footerGroups = [
  {
    title: "Explore", links: [["Browse venues", "/venues"],
    ["Discover games", "/games"],
    // ["Find trainers", "/trainers"]
  ]
  },
  {
    title: "For owners", links: [["Register your venue", "/#for-owners"],
    ["Owner dashboard", "/#for-owners"],
    ["Manage bookings", "/#for-owners"]]
  },
  {
    title: "Platform", links: [["Smart venue booking", "/venues"],
    ["Community games", "/games"],
    ["Secure authentication", "/#for-owners"]]
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[#dfe6e2] bg-[#f7f9f8] px-5 pb-[88px] pt-12 text-[#34413b] md:pb-7 lg:px-10 lg:pt-14">
      <div className="mx-auto max-w-[1240px]">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_repeat(3,1fr)]">
          <div>
            <Logo />
            <p className="mt-5 max-w-[280px] text-sm leading-6 text-[#667a70]">
              Bangladesh&apos;s sports community for booking venues, joining local games, and finding trusted trainers.</p>
            <p className="mt-4 text-xs text-[#829188]">© 2026 Indoor. All rights reserved.</p>
          </div>
          {footerGroups.map((group) => <div key={group.title}>
            <h3 className="text-sm font-bold text-[#1f2b25]">{group.title}</h3>
            <ul className="mt-4 space-y-3">{group.links.map(([label, href]) => <li key={label}>
              <Link href={href} className="text-sm text-[#667a70] transition hover:text-[#08ad5c]">{label}</Link>
            </li>)}
            </ul>
          </div>)}
        </div>
        <div className="mt-10 flex flex-col gap-4 border-t border-[#dfe6e2] pt-6 text-xs text-[#77887f] sm:flex-row sm:items-center sm:justify-between">
          <p>Built for players, coaches, and venue owners across Bangladesh.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-[#08ad5c]">Privacy</Link>
            <Link href="/terms" className="hover:text-[#08ad5c]">Terms</Link>
            <a href="mailto:support@indoor.com" className="hover:text-[#08ad5c]">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
