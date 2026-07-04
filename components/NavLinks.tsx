"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const sportsLinks = [
  { href: "/baseball-training", label: "Baseball Training" },
  { href: "/football-training", label: "Football Training" },
  { href: "/basketball-training", label: "Basketball Training" },
  { href: "/soccer-training", label: "Soccer Training" },
  { href: "/personal-training", label: "Personal Training" },
];

const trainingPaths = [
  "/training-services",
  ...sportsLinks.map((l) => l.href),
];

export default function NavLinks() {
  const pathname = usePathname();

  function linkClass(href: string, matchPaths?: string[]) {
    const active = matchPaths
      ? matchPaths.some((p) => pathname === p || pathname.startsWith(p + "/"))
      : pathname === href || pathname.startsWith(href + "/");

    return `inline-flex min-h-11 items-center px-3 text-xs font-black tracking-[0.12em] uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aio-red focus-visible:ring-offset-2 focus-visible:ring-offset-aio-black ${
      active ? "text-aio-red" : "text-white/85 hover:text-aio-red"
    }`;
  }

  return (
    <div className="hidden items-center gap-1 xl:flex">
      <Link href="/" className={linkClass("/", ["/"])}>
        Home
      </Link>
      <Link href="/events" className={linkClass("/events")}>
        Events
      </Link>

      <div className="group relative">
        <Link
          href="/training-services"
          className={`${linkClass("/training-services", trainingPaths)} gap-1.5`}
        >
          Training &amp; Services
          <span
            aria-hidden
            className="h-2 w-2 rotate-[225deg] border-r-2 border-b-2 border-current transition-transform group-hover:rotate-45 group-focus-within:rotate-45"
          />
        </Link>
        <div className="invisible absolute top-full left-0 w-[260px] opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
          <div className="bg-aio-black p-2 shadow-[0_18px_40px_rgba(0,0,0,0.65)]">
            {sportsLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-3 text-sm font-black transition-colors hover:bg-aio-panel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aio-red ${
                  pathname === link.href
                    ? "text-aio-red"
                    : "text-white/80 hover:text-aio-red-on-dark"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Link href="/pricing-packages" className={linkClass("/pricing-packages")}>
        Pricing &amp; Packages
      </Link>
      <Link href="/contact-us" className={linkClass("/contact-us")}>
        Contact
      </Link>
    </div>
  );
}
