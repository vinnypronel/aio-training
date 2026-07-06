"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import DeleteEventButton from "./DeleteEventButton";

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
      <div className="group relative mx-auto flex w-full max-w-[460px] flex-col overflow-hidden border border-aio-line bg-transparent transition hover:border-aio-red">
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
        <div className="relative h-[260px] sm:h-[300px] w-full overflow-hidden bg-aio-black">
          <Image
            src={event.flyer}
            alt={`${event.title} flyer`}
            fill
            sizes="(min-width: 640px) 400px, 90vw"
            className="object-contain object-center transition duration-500 group-hover:scale-[1.02]"
          />
          <span className="absolute top-0 left-0 bg-aio-red px-3 py-1.5 text-[0.65rem] font-black uppercase tracking-[0.16em] text-white">
            Limited Spots
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-2.5 px-5 py-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-aio-red-on-dark leading-none">
              {event.badge}
            </p>
            <span className="fill-red-on-hover text-[9px] font-black uppercase tracking-[0.16em]">
              Details
            </span>
          </div>

          <h3 className="font-brand-display text-xl font-black uppercase leading-tight text-white">
            {event.title}
          </h3>

          <div className="mt-1 space-y-1.5">
            <div className="border-l-2 border-aio-red pl-2">
              <span className="block text-[9px] font-black uppercase tracking-[0.16em] text-aio-red-on-dark leading-none">
                Date
              </span>
              <span className="mt-0.5 block text-xs font-semibold text-white">
                {event.date}
              </span>
            </div>
            <div className="border-l-2 border-aio-red pl-2">
              <span className="block text-[9px] font-black uppercase tracking-[0.16em] text-aio-red-on-dark leading-none">
                Location
              </span>
              <span className="mt-0.5 block text-xs font-semibold text-white">
                {event.location}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            {sessions.map((s) => {
              const { group, age } = parseSessionLabel(s.label);
              return (
                <div
                  key={s.label}
                  className="border border-aio-line px-2.5 py-1.5 bg-transparent"
                >
                  <div className="text-[9px] font-black uppercase tracking-[0.16em] text-aio-red-on-dark leading-none">
                    {group}
                  </div>
                  {age && (
                    <div className="mt-0.5 text-xs font-black uppercase leading-none text-white">
                      {age}
                    </div>
                  )}
                  <div className="mt-1 text-[9px] font-semibold text-aio-body leading-none">
                    {s.time}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex items-end justify-between pt-2 border-t border-aio-line">
            <div>
              <div className="font-brand-display text-2xl font-black leading-none text-white uppercase">
                {priceInfo.main}
              </div>
              {priceInfo.sub && (
                <div className="mt-0.5 text-[8px] font-black uppercase tracking-[0.12em] text-aio-muted leading-tight max-w-[160px]">
                  {priceInfo.sub}
                </div>
              )}
            </div>
            <div className="relative z-20 flex gap-2">
              <button
                type="button"
                onClick={() => setIsFlyerOpen(true)}
                className="inline-flex min-h-11 items-center justify-center border border-aio-line px-4 text-[10px] font-black uppercase tracking-[0.1em] text-white transition hover:border-white hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aio-red"
              >
                View Flyer
              </button>
              <Link
                href={`/events/${event.slug}`}
                className="inline-flex min-h-11 items-center justify-center bg-aio-red px-5 text-[10px] font-black uppercase tracking-[0.1em] text-white transition hover:bg-aio-red-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                More Info
              </Link>
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
              className="absolute -top-12 right-0 flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.15em] text-white/70 transition hover:text-white"
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
