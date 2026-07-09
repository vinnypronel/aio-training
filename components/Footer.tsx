"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const sportsLinks = [
  { href: "/baseball-training", label: "Baseball Training" },
  { href: "/football-training", label: "Football Training" },
  { href: "/basketball-training", label: "Basketball Training" },
  { href: "/soccer-training", label: "Soccer Training" },
  { href: "/personal-training", label: "Personal Training" },
];

const trainLinks = [
  { href: "/events", label: "Events" },
  { href: "/training-services", label: "Training & Services" },
  { href: "/pricing-packages", label: "Pricing & Packages" },
  { href: "/contact-us", label: "Contact" },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/tos", label: "Terms" },
  { href: "/accessibility", label: "Accessibility" },
];

export default function Footer() {
  const pathname = usePathname();
  return (
    <footer className="relative z-10 border-t border-aio-line bg-aio-black text-white">
      <div className="mx-auto max-w-[1280px] px-6 py-10 md:py-16">
        <div data-reveal-group className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-3 md:justify-items-center">
          <div data-reveal="fade" className="col-span-2 space-y-5 md:col-span-1">
            <Link
              href="/"
              aria-label="All In One Training, home"
              className="inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aio-red focus-visible:ring-offset-2 focus-visible:ring-offset-aio-black"
            >
              <Image
                src="/assets/images/aio-logo-reverse.png"
                alt="All In One Training"
                width={600}
                height={270}
                className="h-auto w-[160px] md:w-[180px]"
              />
            </Link>
            <p className="max-w-[340px] text-base font-semibold leading-7 text-aio-body opacity-0 select-none pointer-events-none">
              Train with the best, All In One place
            </p>
            <div className="space-y-3">
              <a
                href="tel:+17144408053"
                className="flex items-center gap-3"
              >
                <span
                  aria-hidden
                  className="grid h-8 w-8 shrink-0 place-items-center text-aio-red-on-dark"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden>
                    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.32.57 3.58.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.56 21 3 13.44 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.27.2 2.48.57 3.62.1.33.02.7-.24.98L6.6 10.8z" />
                  </svg>
                </span>
                <span className="footer-link text-base font-black">(714) 440-8053</span>
              </a>
              <a
                href="mailto:Trainingallin1@gmail.com"
                className="flex items-center gap-3"
              >
                <span
                  aria-hidden
                  className="grid h-8 w-8 shrink-0 place-items-center text-xl font-black text-aio-red-on-dark"
                >
                  @
                </span>
                <span className="footer-link text-base font-semibold">Trainingallin1@gmail.com</span>
              </a>
              <p className="flex items-center gap-3 text-base font-semibold text-aio-muted md:whitespace-nowrap">
                <span
                  aria-hidden
                  className="grid h-8 w-8 shrink-0 place-items-center text-sm font-black text-aio-red-on-dark"
                >
                  NJ
                </span>
                Sessions across Middlesex/Monmouth County
              </p>
            </div>

          </div>

          <FooterColumn title="Sports" links={sportsLinks} />
          <FooterColumn title="Train With Us" links={trainLinks} />
        </div>
      </div>

      <div className="border-t border-aio-line">
        <div className="mx-auto flex max-w-[1280px] flex-row flex-wrap items-center justify-between gap-4 px-6 py-3 text-xs font-semibold text-aio-muted md:py-4">
          <p className="text-left w-full order-last md:w-auto md:order-1">© 2026 All In One Training. All rights reserved.</p>
          <nav className="flex items-center gap-4 order-1 md:order-2" aria-label="Social links">
            <div className="relative h-11 w-11 md:w-11">
              <a
                href="https://www.instagram.com/aio_training"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow AIO Training on Instagram"
                className="group flex h-11 w-11 items-center justify-center border border-aio-line bg-aio-black text-aio-body transition-all duration-300 hover:border-white hover:text-white md:absolute md:right-0 md:top-0 md:justify-end md:overflow-hidden md:hover:w-[140px]"
              >
                <span className="hidden pl-4 text-sm font-bold whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover:opacity-100 md:block">
                  Instagram
                </span>
                <div className="grid h-11 w-11 shrink-0 place-items-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden>
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </div>
              </a>
            </div>

            <div className="relative h-11 w-11 md:w-11">
              <a
                href="https://www.facebook.com/people/AIO-training/61589139513684/#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow AIO Training on Facebook"
                className="group flex h-11 w-11 items-center justify-center border border-aio-line bg-aio-black text-aio-body transition-all duration-300 hover:border-white hover:text-white md:absolute md:left-0 md:top-0 md:justify-start md:overflow-hidden md:hover:w-[140px]"
              >
                <div className="grid h-11 w-11 shrink-0 place-items-center">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden>
                    <path d="M13.5 21.5v-8h2.7l.4-3.1h-3.1V8.4c0-.9.2-1.5 1.5-1.5h1.7V4.2c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.2H7.5v3.1h2.8v8h3.2z" />
                  </svg>
                </div>
                <span className="hidden pr-4 text-sm font-bold whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover:opacity-100 md:block">
                  Facebook
                </span>
              </a>
            </div>
          </nav>
          <nav className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 order-2 md:order-3 text-right" aria-label="Legal links">
            {legalLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`footer-link text-sm font-semibold ${isActive ? "active" : ""}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div data-reveal className="space-y-4">
      <h2 className="text-base font-black uppercase tracking-[0.18em] text-aio-red-on-dark">
        {title}
      </h2>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="footer-link text-base font-bold">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
