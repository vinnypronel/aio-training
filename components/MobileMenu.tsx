"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import HoverButton from "@/components/HoverButton";

const primaryLinks = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/training-services", label: "Training & Services" },
  { href: "/pricing-packages", label: "Pricing & Packages" },
  { href: "/contact-us", label: "Contact" },
];

const sportsLinks = [
  { href: "/baseball-training", label: "Baseball" },
  { href: "/football-training", label: "Football" },
  { href: "/basketball-training", label: "Basketball" },
  { href: "/soccer-training", label: "Soccer" },
  { href: "/personal-training", label: "Personal Training" },
];

const CURTAIN_EASE = "ease-[cubic-bezier(0.77,0,0.18,1)]";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  const reveal = () =>
    `transition-all duration-500 ease-out motion-reduce:transition-none ${
      open ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
    }`;

  const revealDelay = (index: number) => ({
    transitionDelay: open ? `${220 + index * 55}ms` : "0ms",
  });

  const overlay = (
    <div
      ref={dialogRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      inert={!open}
      className={`fixed inset-x-0 bottom-0 top-20 z-40 outline-none lg:top-24 lg:hidden ${open ? "" : "pointer-events-none"}`}
    >
      {/* Red flash curtain — leads the reveal, trails the exit */}
      <div
        aria-hidden
        className={`absolute inset-0 origin-top transform-gpu bg-aio-red transition-transform will-change-transform ${CURTAIN_EASE} motion-reduce:transition-none ${
          open
            ? "duration-500 translate-y-0"
            : "delay-100 duration-500 -translate-y-full"
        }`}
      />

      {/* Main panel */}
      <div
        className={`absolute inset-0 flex origin-top transform-gpu flex-col overflow-hidden bg-aio-black text-white transition-transform will-change-transform ${CURTAIN_EASE} motion-reduce:transition-none ${
          open
            ? "delay-100 duration-[600ms] translate-y-0"
            : "duration-500 -translate-y-full"
        }`}
      >
        {/* Atmosphere: red glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-40 -top-40 h-[26rem] w-[26rem] rounded-full bg-aio-red/20 blur-[130px]"
        />

        {/* Scrollable body */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-2 [-ms-overflow-style:none] [scrollbar-width:none] md:px-6 [&::-webkit-scrollbar]:hidden">
          <div className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col justify-center py-[min(1.5rem,2svh)]">
            <nav aria-label="Primary" className="flex flex-col">
              {primaryLinks.map((link, i) => {
                const active = pathname === link.href;
                const hasSubs = link.href === "/training-services";
                return (
                  <div
                    key={link.href}
                    className={`border-b border-aio-line ${reveal()}`}
                    style={revealDelay(i)}
                  >
                    <Link
                      href={link.href}
                      onClick={close}
                      aria-current={active ? "page" : undefined}
                      className="group flex items-baseline gap-4 py-[min(0.75rem,1svh)] focus-visible:outline-none sm:gap-6"
                    >
                      <span
                        className={`w-7 shrink-0 font-brand-display text-xs sm:text-sm font-bold tracking-[0.15em] transition-colors ${
                          active ? "text-aio-red-on-dark" : "text-aio-muted group-hover:text-aio-red-on-dark"
                        }`}
                      >
                        0{i + 1}
                      </span>
                      <span
                        className={`whitespace-nowrap font-brand-display text-[clamp(1.25rem,min(7.5vw,4.8svh),4rem)] font-black uppercase leading-[0.95] tracking-tight transition-colors group-focus-visible:text-aio-red-on-dark ${
                          active ? "text-aio-red-on-dark" : "text-white group-hover:text-aio-red-on-dark"
                        }`}
                      >
                        {link.label}
                      </span>
                      <span
                        aria-hidden
                        className="ml-auto -translate-x-3 self-center font-brand-display text-2xl font-black text-aio-red-on-dark opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
                      >
                        →
                      </span>
                    </Link>
                    {hasSubs && (
                      <div className="flex flex-col pb-[min(0.75rem,1.2svh)] pl-11 sm:pl-[3.25rem]">
                        {sportsLinks.map((sport) => {
                          const sportActive = pathname === sport.href;
                          return (
                            <Link
                              key={sport.href}
                              href={sport.href}
                              onClick={close}
                              aria-current={sportActive ? "page" : undefined}
                              className={`group/sub flex items-center gap-3.5 py-[min(0.5rem,0.7svh)] font-brand-display text-[clamp(0.95rem,min(5.5vw,3svh),1.85rem)] font-black uppercase leading-tight tracking-[0.06em] transition-colors focus-visible:outline-none focus-visible:text-aio-red-on-dark ${
                                sportActive
                                  ? "text-aio-red-on-dark"
                                  : "text-white hover:text-aio-red-on-dark"
                              }`}
                            >
                              <span
                                aria-hidden
                                className={`h-0.5 w-3 shrink-0 transition-colors ${
                                  sportActive ? "bg-aio-red-on-dark" : "bg-aio-red group-hover/sub:bg-aio-red-on-dark"
                                }`}
                              />
                              {sport.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            <div
              className={`mt-[min(2.5rem,3.5svh)] pt-[min(1rem,1.5svh)] ${reveal()}`}
              style={revealDelay(primaryLinks.length)}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <HoverButton href="tel:+17144408053" variant="outline" className="flex-1">
                    Call (714) 440-8053
                  </HoverButton>
                  <div className="flex shrink-0 gap-3">
                    <a
                      href="https://www.instagram.com/aio_training"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={close}
                      aria-label="Follow AIO Training on Instagram"
                      className="grid h-11 w-11 place-items-center border border-white/35 text-white transition hover:border-white hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aio-red focus-visible:ring-offset-2 focus-visible:ring-offset-aio-black"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
                        <rect x="3" y="3" width="18" height="18" rx="5" />
                        <circle cx="12" cy="12" r="4" />
                        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                      </svg>
                    </a>
                    <a
                      href="https://www.facebook.com/people/AIO-training/61589139513684/"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={close}
                      aria-label="Follow AIO Training on Facebook"
                      className="grid h-11 w-11 place-items-center border border-white/35 text-white transition hover:border-white hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aio-red focus-visible:ring-offset-2 focus-visible:ring-offset-aio-black"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
                        <path d="M13.5 21.5v-8h2.7l.4-3.1h-3.1V8.4c0-.9.2-1.5 1.5-1.5h1.7V4.2c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.2H7.5v3.1h2.8v8h3.2z" />
                      </svg>
                    </a>
                  </div>
                </div>
                <HoverButton href="/booking" className="w-full">
                  Book Now
                </HoverButton>
              </div>

              <p className="mt-[min(1.25rem,1.8svh)] whitespace-nowrap text-center text-[min(0.7rem,2.5vw)] font-bold uppercase tracking-[0.1em] text-aio-muted">
                All In One Training · Build Your Athlete&apos;s Next Level
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="grid h-11 w-11 place-items-center border border-aio-line-strong text-white transition hover:border-aio-red hover:text-aio-red-on-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aio-red focus-visible:ring-offset-2 focus-visible:ring-offset-aio-black lg:hidden"
      >
        <MenuIcon isOpen={open} />
      </button>

      {mounted && createPortal(overlay, document.body)}
    </>
  );
}

function MenuIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <span aria-hidden className="relative block h-5 w-5">
      <span
        className={`absolute left-1/2 h-0.5 bg-current transition-all duration-300 ease-out ${
          isOpen
            ? "top-1/2 w-5 -translate-x-1/2 -translate-y-1/2 rotate-45"
            : "top-[6px] w-3.5 -translate-x-[80%] rotate-0"
        }`}
      />
      <span
        className={`absolute left-1/2 h-0.5 bg-current transition-all duration-300 ease-out ${
          isOpen
            ? "top-1/2 w-5 -translate-x-1/2 -translate-y-1/2 -rotate-45"
            : "top-[12px] w-3.5 -translate-x-[20%] rotate-0"
        }`}
      />
    </span>
  );
}
