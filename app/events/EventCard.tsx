"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import DeleteEventButton from "./DeleteEventButton";
import HoverButton from "@/components/HoverButton";

export interface EventSession {
  label: string;
  time: string;
}

interface EventCardProps {
  event: {
    id: string;
    slug: string;
    flyer: string;
    tag: string;
    badge: string;
    title: string;
    date: string;
    location: string;
    sessions: string;
    price: string;
  };
  isAdmin: boolean;
}

function parseSessionLabel(label: string) {
  const parts = label.split("—");
  if (parts.length > 1) {
    return {
      group: parts[0].trim(),
      age: parts[1].trim(),
    };
  }
  return {
    group: label,
    age: "",
  };
}

function parsePrice(price: string) {
  const throughIdx = price.toLowerCase().indexOf("through");
  if (throughIdx !== -1) {
    return {
      main: price.substring(0, throughIdx).trim(),
      sub: price.substring(throughIdx).trim(),
    };
  }
  const dashIdx = price.indexOf("—");
  if (dashIdx !== -1) {
    return {
      main: price.substring(0, dashIdx).trim(),
      sub: price.substring(dashIdx + 1).trim(),
    };
  }
  return {
    main: price,
    sub: "",
  };
}

export default function EventCard({ event, isAdmin }: EventCardProps) {
  const [isFlyerOpen, setIsFlyerOpen] = useState(false);

  let sessions: EventSession[] = [];
  try {
    const parsed = JSON.parse(event.sessions);
    if (Array.isArray(parsed)) sessions = parsed;
  } catch {
    // malformed session data — render the card without the session grid
  }

  const priceInfo = parsePrice(event.price);

  useEffect(() => {
    if (!isFlyerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFlyerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isFlyerOpen]);

  return (
    <>
      <div className="group relative mx-auto flex w-full max-w-[460px] flex-col overflow-hidden bg-transparent transition lg:max-w-none lg:flex-row lg:items-stretch lg:overflow-visible">
        {/* Full-card link overlay — keeps sibling buttons out of an anchor */}
        <Link
          href={`/events/${event.slug}`}
          aria-label={`${event.title} — view event details`}
          className="absolute inset-0 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aio-red"
        />
        {isAdmin && (
          <div className="relative z-20">
            <DeleteEventButton eventId={event.id} />
          </div>
        )}
        <div className="relative h-[260px] w-full shrink-0 overflow-hidden bg-aio-black sm:h-[300px] lg:h-auto lg:aspect-[4/5] lg:w-[460px] lg:bg-transparent">
          <Image
            src={event.flyer}
            alt={`${event.title} flyer`}
            fill
            sizes="(min-width: 1024px) 540px, 90vw"
            className="object-contain object-center transition duration-500 group-hover:scale-[1.02]"
          />
          <span className="absolute top-0 left-0 bg-aio-red px-3 py-1.5 text-[0.65rem] font-black uppercase tracking-[0.16em] text-white">
            Limited Spots
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-6 px-5 py-4 transition lg:justify-between lg:gap-0 lg:px-12 lg:py-10">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-aio-red-on-dark leading-none lg:text-[14px]">
              {event.badge}
            </p>
            <h3 className="font-brand-display text-xl font-black uppercase leading-tight text-white lg:text-5xl lg:whitespace-nowrap mt-2.5">
              {event.title}
            </h3>
          </div>

          <div className="flex flex-col gap-2.5 lg:gap-6">
            <div className="grid grid-cols-2 gap-1.5 lg:grid-cols-2 lg:gap-x-14">
              <div>
                <span className="block text-[9px] font-black uppercase tracking-[0.16em] text-aio-red-on-dark leading-none lg:text-[15px]">
                  Location
                </span>
                <a
                  href={event.location.toLowerCase().includes("heavenly farms")
                    ? "https://www.google.com/maps/place/heavenly+farms+park+east+brunswick/data=!4m2!3m1!1s0x89c3c53d822a9291:0x85ea3f9097a22d41?sa=X&ved=1t:155783&ictx=111"
                    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative z-20 mt-0.5 inline-flex items-start gap-1.5 text-xs font-semibold text-white hover:text-aio-red transition lg:mt-1 lg:text-[1.45rem] leading-snug group/loc"
                >
                  <span className="leading-snug">
                    {event.location.includes(",") ? (
                      <>
                        {event.location.split(",")[0]},
                        <span className="block text-[0.85em] opacity-85 mt-0.5 font-normal">
                          {event.location.split(",").slice(1).join(",").trim()}
                        </span>
                      </>
                    ) : (
                      event.location
                    )}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="mt-[0.2em] shrink-0 w-[0.75em] h-[0.75em] opacity-60 group-hover/loc:opacity-100 transition"
                    aria-hidden="true"
                  >
                    <path d="M6.22 8.72a.75.75 0 0 0 1.06 1.06l5.22-5.22v1.69a.75.75 0 0 0 1.5 0v-3.5a.75.75 0 0 0-.75-.75h-3.5a.75.75 0 0 0 0 1.5h1.69L6.22 8.72Z" />
                    <path d="M3.5 6.75c0-.69.56-1.25 1.25-1.25H7A.75.75 0 0 0 7 4H4.75A2.75 2.75 0 0 0 2 6.75v4.5A2.75 2.75 0 0 0 4.75 14h4.5A2.75 2.75 0 0 0 12 11.25V9a.75.75 0 0 0-1.5 0v2.25c0 .69-.56 1.25-1.25 1.25h-4.5c-.69 0-1.25-.56-1.25-1.25v-4.5Z" />
                  </svg>
                </a>
              </div>
              <div>
                <span className="block text-[9px] font-black uppercase tracking-[0.16em] text-aio-red-on-dark leading-none lg:text-[15px]">
                  Date &amp; Time
                </span>
                <span className="mt-0.5 block text-xs font-semibold text-white lg:mt-1 lg:text-[1.45rem] leading-snug">
                  {event.date}
                  {sessions[0] && (
                    <span className="block text-[0.85em] opacity-85 mt-0.5 font-normal">
                      @ {sessions[0].time}
                    </span>
                  )}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-2 lg:mt-0 lg:gap-x-14">
              {sessions.map((s) => {
                const { group, age } = parseSessionLabel(s.label);
                return (
                  <div key={s.label}>
                    <span className="block text-[9px] font-black uppercase tracking-[0.16em] text-aio-red-on-dark leading-none lg:text-[15px]">
                      {group}
                    </span>
                    {age && (
                      <span className="mt-0.5 block text-xs font-semibold text-white lg:mt-1 lg:text-[1.45rem]">
                        {age}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <div className="font-brand-display text-2xl font-black leading-none text-white uppercase lg:text-5xl">
                {priceInfo.main}
              </div>
              {priceInfo.sub && (
                <div className="mt-0.5 text-[8px] font-black uppercase tracking-[0.12em] text-aio-muted leading-tight max-w-[160px] lg:mt-1.5 lg:text-[12px] lg:max-w-[280px]">
                  {priceInfo.sub}
                </div>
              )}
            </div>
            <div className="relative z-20 flex gap-2 lg:gap-3">
              <HoverButton
                variant="outline"
                onClick={() => setIsFlyerOpen(true)}
                className="min-h-11 px-4 text-[10px] lg:min-h-14 lg:px-8 lg:text-[14px]"
              >
                View Flyer
              </HoverButton>
              <HoverButton
                variant="red"
                href={`/events/${event.slug}`}
                className="min-h-11 px-5 text-[10px] lg:min-h-14 lg:px-9 lg:text-[14px]"
              >
                More Info
              </HoverButton>
            </div>
          </div>
        </div>
      </div>

      {isFlyerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${event.title} flyer`}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm transition-all duration-300"
        >
          {/* Backdrop Click */}
          <div
            className="absolute inset-0 cursor-zoom-out"
            onClick={() => setIsFlyerOpen(false)}
          />
          <div className="relative z-10 flex max-h-[calc(90vh/var(--dz,1))] max-w-[calc(90vw/var(--dz,1))] items-center justify-center">
            {/* Close Button */}
            <button
              onClick={() => setIsFlyerOpen(false)}
              className="absolute -top-12 right-0 flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.15em] text-white/70 cursor-pointer transition hover:text-white"
              aria-label="Close modal"
            >
              <span>Close</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                className="h-4 w-4"
              >
                <line x1={18} y1={6} x2={6} y2={18} />
                <line x1={6} y1={6} x2={18} y2={18} />
              </svg>
            </button>
            {/* Modal Image Wrapper */}
            <div className="relative border border-aio-line bg-aio-black p-2 shadow-2xl">
              <img
                src={event.flyer}
                alt={`${event.title} flyer fullscreen`}
                className="max-h-[calc(80vh/var(--dz,1))] max-w-[calc(85vw/var(--dz,1))] object-contain shadow-lg"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
