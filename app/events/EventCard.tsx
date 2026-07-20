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
  // Split "Group — Ages X-Y" on an em dash, en dash, or spaced hyphen so the
  // age reads cleanly regardless of how the label is punctuated. The regex
  // requires surrounding whitespace so the internal hyphen in "8-12" is kept.
  const parts = label.split(/\s+[—–-]\s+/);
  if (parts.length > 1) {
    return {
      group: parts[0].trim(),
      age: parts.slice(1).join(" ").trim(),
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
  const dashMatch = price.match(/\s+(?:-|[\u2013\u2014])\s+/);
  if (dashMatch?.index !== undefined) {
    const dashIdx = dashMatch.index;
    return {
      main: price.substring(0, dashIdx).trim(),
      sub: price.substring(dashIdx + dashMatch[0].length).trim(),
    };
  }
  return {
    main: price,
    sub: "",
  };
}

export default function EventCard({ event, isAdmin }: EventCardProps) {
  const [isFlyerOpen, setIsFlyerOpen] = useState(false);
  const [isMapsOpen, setIsMapsOpen] = useState(false);
  const isFootballGroupSession = event.slug === "football-skills-clinic";
  const displayTitle = isFootballGroupSession
    ? "AIO Football Skills Group Session"
    : event.title;
  const displayPrice = isFootballGroupSession
    ? "$20 per day - $40 both days per athlete"
    : event.price;
  const displayLocation = isFootballGroupSession
    ? "Heavenly Farms Park, East Brunswick, NJ"
    : event.location;
  const flyerSrc = isFootballGroupSession
    ? "/assets/images/group_session_flyer.png"
    : event.flyer;
  const locationQuery = encodeURIComponent(displayLocation);
  const defaultMapsHref = `geo:0,0?q=${locationQuery}`;
  const appleMapsHref = `https://maps.apple.com/?q=${locationQuery}`;

  let sessions: EventSession[] = [];
  try {
    const parsed = JSON.parse(event.sessions);
    if (Array.isArray(parsed)) sessions = parsed;
  } catch {
    // malformed session data — render the card without the session grid
  }

  const priceInfo = parsePrice(displayPrice);

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

  useEffect(() => {
    if (!isMapsOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMapsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMapsOpen]);

  return (
    <>
      <div className="group relative mx-auto flex w-full max-w-[460px] flex-col overflow-hidden bg-transparent transition lg:max-w-none lg:flex-row lg:items-stretch lg:overflow-visible">
        {isAdmin && (
          <div className="relative z-20">
            <DeleteEventButton eventId={event.id} />
          </div>
        )}

        {/* Title shown above flyer on mobile only */}
        <div className="lg:hidden px-5 mb-4">
          <h3 className="font-brand-display text-2xl font-black uppercase leading-[0.95] text-white">
            {displayTitle.includes("Group Session") ? (
              <>
                {displayTitle.replace("Group Session", "").trim()}
                <span className="block">Group Session</span>
              </>
            ) : displayTitle.includes("Skills Clinic") ? (
              <>
                {displayTitle.replace("Skills Clinic", "").trim()}
                <span className="block">Skills Clinic</span>
              </>
            ) : (
              displayTitle
            )}
          </h3>
        </div>

        <Link
          href={`/events/${event.slug}`}
          aria-label={`${displayTitle} - view event details`}
          className="relative z-20 block h-[260px] w-full shrink-0 overflow-hidden bg-aio-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aio-red sm:h-[300px] lg:h-auto lg:aspect-[2/3] lg:w-[440px] lg:bg-transparent"
        >
          <Image
            src={flyerSrc}
            alt={`${displayTitle} flyer`}
            fill
            sizes="(min-width: 1024px) 540px, 90vw"
            className="object-contain object-center transition duration-500 group-hover:scale-[1.02]"
          />
        </Link>
        <div className="flex flex-1 flex-col gap-7 px-5 py-6 transition lg:justify-between lg:gap-8 lg:px-12 lg:py-11">
          {/* Title + subtitle (badge folded in as a red-tick subtitle, no eyebrow) */}
          <div className="hidden lg:block">
            <h3 className="font-brand-display text-2xl font-black uppercase leading-[0.95] text-white lg:text-[3.4rem] lg:leading-[0.9]">
              {displayTitle.includes("Group Session") ? (
                <>
                  {displayTitle.replace("Group Session", "").trim()}
                  <span className="block">Group Session</span>
                </>
              ) : displayTitle.includes("Skills Clinic") ? (
                <>
                  {displayTitle.replace("Skills Clinic", "").trim()}
                  <span className="block">Skills Clinic</span>
                </>
              ) : (
                displayTitle
              )}
            </h3>
          </div>

          {/* Event details and actions */}
          <div className="flex flex-col gap-7 lg:gap-8">
            
            {/* Left Column: Event details (Date, Time, Location, Ages) */}
            <div className="flex flex-col gap-3.5 lg:gap-4">
              <div className="flex items-center gap-3 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden
                  className="h-5 w-5 shrink-0 text-aio-red lg:h-6 lg:w-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 8.25h18M4.5 5.25h15A1.5 1.5 0 0 1 21 6.75v12A1.5 1.5 0 0 1 19.5 20.25h-15A1.5 1.5 0 0 1 3 18.75v-12A1.5 1.5 0 0 1 4.5 5.25Z" />
                </svg>
                <span className="text-lg font-semibold leading-tight lg:text-xl">
                  {event.date}
                </span>
              </div>
              {sessions[0] && (
                <div className="flex items-center gap-3 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden
                    className="h-5 w-5 shrink-0 text-aio-red lg:h-6 lg:w-6"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <span className="text-lg font-semibold leading-tight lg:text-xl">
                    {sessions[0].time}
                  </span>
                </div>
              )}
              <button
                type="button"
                onClick={() => setIsMapsOpen(true)}
                className="group/loc relative z-20 inline-flex w-fit items-start gap-3 text-white transition hover:text-aio-red"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden
                  className="mt-0.5 h-5 w-5 shrink-0 text-aio-red lg:mt-1 lg:h-6 lg:w-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                <div className="flex flex-col text-left text-lg font-semibold leading-tight lg:text-xl">
                    {displayLocation.includes(",") ? (
                      <>
                        <span className="block">{displayLocation.split(",")[0]}</span>
                        <span className="mt-0.5 block leading-normal">
                          {displayLocation.split(",").slice(1).join(",").trim()}
                        </span>
                      </>
                    ) : (
                      <span>{displayLocation}</span>
                    )}
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  aria-hidden
                  className="mt-1 h-4 w-4 shrink-0 opacity-50 transition group-hover/loc:opacity-100 lg:mt-1.5 lg:h-[18px] lg:w-[18px]"
                >
                  <path d="M6.22 8.72a.75.75 0 0 0 1.06 1.06l5.22-5.22v1.69a.75.75 0 0 0 1.5 0v-3.5a.75.75 0 0 0-.75-.75h-3.5a.75.75 0 0 0 0 1.5h1.69L6.22 8.72Z" />
                  <path d="M3.5 6.75c0-.69.56-1.25 1.25-1.25H7A.75.75 0 0 0 7 4H4.75A2.75 2.75 0 0 0 2 6.75v4.5A2.75 2.75 0 0 0 4.75 14h4.5A2.75 2.75 0 0 0 12 11.25V9a.75.75 0 0 0-1.5 0v2.25c0 .69-.56 1.25-1.25 1.25h-4.5c-.69 0-1.25-.56-1.25-1.25v-4.5Z" />
                </svg>
              </button>

              <div className="flex items-start justify-between gap-4 lg:mt-1 lg:block">
                {/* Age groups as child items */}
                {sessions.length > 0 && (
                  <div className="flex min-w-0 flex-col gap-3.5 lg:gap-4">
                    {sessions.map((s) => {
                      const { age } = parseSessionLabel(s.label);
                      const isTeen = (age || s.label).toLowerCase().includes("13") || (age || s.label).toLowerCase().includes("teen");
                      return (
                        <div key={s.label} className="flex items-center gap-3 text-white">
                          {isTeen ? (
                            /* Bigger person icon for older kids / teens */
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden
                              className="h-5 w-5 shrink-0 text-aio-red lg:h-6 lg:w-6"
                            >
                              <circle cx="12" cy="7" r="4.2" />
                              <path d="M4.5 19.5a7.5 7.5 0 0 1 15 0" />
                            </svg>
                          ) : (
                            /* Smaller person icon for younger kids */
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden
                              className="h-5 w-5 shrink-0 text-aio-red lg:h-6 lg:w-6"
                            >
                              <circle cx="12" cy="8.5" r="3" />
                              <path d="M7 18.5a5 5 0 0 1 10 0" />
                            </svg>
                          )}
                          <span className="text-lg font-semibold leading-tight lg:text-xl">
                            {age || s.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
                <div className="relative z-20 flex shrink-0 flex-col gap-2 lg:hidden">
                  <HoverButton
                    variant="red"
                    href={`/events/${event.slug}`}
                    className="!min-h-9 w-[112px] px-2.5 text-[8px]"
                  >
                    More Info
                  </HoverButton>
                  <HoverButton
                    variant="outline"
                    onClick={(event) => {
                      event.stopPropagation();
                      setIsFlyerOpen(true);
                    }}
                    className="!min-h-9 w-[112px] px-2.5 text-[8px]"
                  >
                    View Flyer
                  </HoverButton>
                </div>
              </div>
            </div>

            {/* Right Column: Price and Buttons block (stacks vertically on mobile, side-by-side on desktop) */}
            <div className="order-first flex items-start justify-between gap-3 lg:order-none lg:w-full lg:flex-row lg:items-end lg:gap-4 lg:-translate-y-[10px]">
              <div className="min-w-0 lg:border-t lg:border-aio-line lg:pt-8">
                <span className="mb-2.5 inline-flex justify-center bg-aio-red px-2.5 py-1 text-center text-[0.6rem] font-black uppercase tracking-[0.16em] text-white lg:inline-block lg:w-auto lg:text-left">
                  Limited Spots
                </span>
                <div className="whitespace-nowrap font-brand-display text-[2.15rem] font-black uppercase leading-none text-white lg:text-5xl">
                  {priceInfo.main}
                </div>
                {priceInfo.sub && (
                  <div className="mt-1.5 max-w-[190px] text-[0.58rem] font-semibold uppercase tracking-[0.12em] leading-tight text-aio-muted lg:max-w-[300px] lg:text-xs">
                    {priceInfo.sub}
                  </div>
                )}
              </div>
              <div className="relative z-20 hidden shrink-0 flex-col gap-2 lg:flex lg:-translate-x-[40px]">
                <HoverButton
                  variant="red"
                  href={`/events/${event.slug}`}
                  className="!min-h-9 w-[112px] px-2.5 text-[8px] lg:!min-h-11 lg:w-[145px] lg:px-5 lg:text-[12px]"
                >
                  More Info
                </HoverButton>
                <HoverButton
                  variant="outline"
                  onClick={(event) => {
                    event.stopPropagation();
                    setIsFlyerOpen(true);
                  }}
                  className="!min-h-9 w-[112px] px-2.5 text-[8px] lg:!min-h-11 lg:w-[145px] lg:px-5 lg:text-[12px]"
                >
                  View Flyer
                </HoverButton>
              </div>
            </div>

          </div>
        </div>
      </div>

      {isFlyerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${displayTitle} flyer`}
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
                src={flyerSrc}
                alt={`${displayTitle} flyer fullscreen`}
                className="max-h-[calc(80vh/var(--dz,1))] max-w-[calc(85vw/var(--dz,1))] object-contain shadow-lg"
              />
            </div>
          </div>
        </div>
      )}

      {isMapsOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Choose maps app"
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/75 p-4 backdrop-blur-sm sm:items-center"
        >
          <button
            type="button"
            aria-label="Close maps options"
            className="absolute inset-0 cursor-default"
            onClick={() => setIsMapsOpen(false)}
          />
          <div className="relative z-10 w-full max-w-[360px] border border-aio-line bg-aio-black p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-aio-red">
                  Open Address
                </p>
                <p className="mt-2 text-sm font-black leading-snug text-white">
                  {displayLocation}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsMapsOpen(false)}
                aria-label="Close maps options"
                className="-mr-2 -mt-2 flex h-9 w-9 items-center justify-center text-white/60 transition hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  className="h-4 w-4"
                >
                  <line x1={18} y1={6} x2={6} y2={18} />
                  <line x1={6} y1={6} x2={18} y2={18} />
                </svg>
              </button>
            </div>

            <div className="mt-5 grid gap-3">
              <a
                href={defaultMapsHref}
                onClick={() => setIsMapsOpen(false)}
                className="flex min-h-12 items-center justify-center bg-aio-red px-5 text-xs font-black uppercase tracking-[0.1em] text-white transition hover:bg-aio-red-hover"
              >
                Default Maps App
              </a>
              <a
                href={appleMapsHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMapsOpen(false)}
                className="flex min-h-12 items-center justify-center border border-white/35 px-5 text-xs font-black uppercase tracking-[0.1em] text-white transition hover:border-white hover:bg-white hover:text-aio-black"
              >
                Apple Maps
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
