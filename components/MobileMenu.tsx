"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
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

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
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

  const overlay = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      aria-hidden={!open}
      className={`fixed inset-x-0 top-20 bottom-0 z-[40] flex flex-col bg-aio-black text-white transition-transform duration-500 ease-out lg:top-24 xl:hidden ${
        open ? "translate-y-0" : "pointer-events-none -translate-y-[calc(100%+5rem)] lg:-translate-y-[calc(100%+6rem)]"
      }`}
    >
      <div className="flex flex-1 flex-col overflow-y-auto px-6 py-8">
        <nav className="flex flex-col gap-4">
          {primaryLinks.map((link) => (
            <div key={link.href} className="w-full">
              <Link
                href={link.href}
                onClick={close}
                className="block py-4 font-brand-display text-3xl font-black uppercase tracking-tight text-white transition-colors hover:text-aio-red-on-dark sm:text-4xl"
              >
                {link.label}
              </Link>
              {link.href === "/training-services" && (
                <div className="flex flex-col gap-1 pb-2 pl-6">
                  {sportsLinks.map((sport) => (
                    <Link
                      key={sport.href}
                      href={sport.href}
                      onClick={close}
                      className="py-1.5 text-left text-sm font-black uppercase tracking-[0.1em] text-aio-muted transition hover:text-aio-red-on-dark"
                    >
                      – {sport.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="mt-auto w-full max-w-xs space-y-3 pt-8">
          <HoverButton href="tel:+17144408053" variant="outline" className="w-full">
            Call (714) 440-8053
          </HoverButton>
          <HoverButton href="/booking" className="w-full">
            Get Started
          </HoverButton>
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
        className="grid h-11 w-11 place-items-center border border-aio-line-strong text-white transition hover:border-aio-red hover:text-aio-red-on-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aio-red focus-visible:ring-offset-2 focus-visible:ring-offset-aio-black xl:hidden"
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
