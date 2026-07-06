import Image from "next/image";
import HoverButton from "@/components/HoverButton";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import AddEventForm from "./AddEventForm";
import EventCard from "./EventCard";

export const metadata = {
  title: "Events | AIO Training",
};

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const [events, session] = await Promise.all([
    prisma.event.findMany({ orderBy: { sortOrder: "asc" } }),
    getSession(),
  ]);

  const isAdmin = !!session;
  const firstEvent = events[0];

  return (
    <>
      <section className="relative flex h-[calc(90svh/var(--dz,1))] items-center overflow-hidden bg-aio-black pt-24 text-white">
        <Image
          src="/assets/images/home-field-drills.webp"
          alt="Athletes doing cone drills on turf"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[image:var(--aio-hero-gradient)] opacity-95 mix-blend-multiply"
        />
        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-6 py-20">
          <div className="h-1 w-12 -skew-x-[18deg] bg-aio-red" />
          <p className="hero-item mt-3 text-xs font-black uppercase tracking-[0.28em] text-aio-red">
            Train with the best, All In One place
          </p>
          <h1 className="hero-item mt-4 font-brand-display text-[clamp(2.75rem,7vw,6rem)] font-black uppercase leading-[0.9]" style={{ animationDelay: "120ms" }}>
            Upcoming<br />
            <span className="text-aio-red">Events</span>
          </h1>
          {firstEvent ? (
            <>
              <p className="hero-item mt-5 max-w-[680px] text-base font-semibold leading-8 text-aio-body md:text-lg" style={{ animationDelay: "260ms" }}>
                Check out our upcoming events and register before spots fill up.
              </p>
              <div className="hero-item mt-7 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "400ms" }}>
                <HoverButton href={`/events/${firstEvent.slug}`}>
                  Reserve Your Spot
                </HoverButton>
                <HoverButton href={`/events/${firstEvent.slug}`} variant="outline">
                  View Event Details
                </HoverButton>
              </div>
            </>
          ) : (
            <p className="mt-5 max-w-[680px] text-base font-semibold leading-8 text-aio-body md:text-lg">
              No upcoming events right now. Check back soon.
            </p>
          )}

        </div>
      </section>

      <section className="bg-aio-black py-20 md:py-24">
        <div data-reveal-group className="mx-auto max-w-[1280px] px-6">
          <p data-reveal className="text-xs font-black uppercase tracking-[0.28em] text-aio-red-on-dark">
            Upcoming Events
          </p>
          <h2 data-reveal className="mt-3 font-brand-display text-[clamp(2.25rem,5vw,4.5rem)] font-black uppercase leading-none">
            Reserve From<br className="lg:hidden" /> The Board.
          </h2>
          <div aria-hidden className="mt-4 h-px w-full bg-aio-line" />
          <p data-reveal className="mt-4 text-sm font-bold uppercase tracking-[0.12em] text-aio-muted">
            Showing {events.length} event{events.length !== 1 ? "s" : ""}
          </p>

          {events.length > 0 ? (
            <div className="mx-auto mt-10 grid max-w-[900px] gap-6 sm:grid-cols-2 sm:[&>*:only-child]:col-span-2">
              {events.map((event) => (
                <div key={event.id} data-reveal>
                  <EventCard event={event} isAdmin={isAdmin} />
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-10 text-center text-sm font-semibold text-aio-muted">
              No events scheduled at this time.
            </p>
          )}

          {isAdmin && <AddEventForm />}
        </div>
      </section>

      <section className="relative overflow-hidden bg-aio-black border-t border-aio-line py-16 text-white md:py-20">
        <div aria-hidden className="pointer-events-none absolute inset-0 mx-auto max-w-[1280px]">
          <p className="absolute right-[40px] lg:right-[-130px] bottom-0 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 lg:-mt-[75px] text-right font-brand-display text-[clamp(5rem,17vw,14rem)] font-black uppercase leading-none text-white/10">
            Events
          </p>
        </div>
        <div className="relative z-10 mx-auto grid max-w-[1280px] gap-8 px-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div data-reveal-group className="max-w-[800px] lg:-translate-x-[130px] transition-transform duration-500">
            <p data-reveal className="text-xs font-black uppercase tracking-[0.24em] text-white">
              Questions?
            </p>
            <h2 data-reveal className="mt-3 font-brand-display text-[clamp(2.5rem,6vw,5.5rem)] font-black uppercase leading-[0.9]">
              Call Before<br />You Reserve.
            </h2>
            <p data-reveal className="mt-5 max-w-[660px] text-sm font-semibold leading-relaxed text-white">
              Use the flyer phone number if you need help choosing the right session.
            </p>
          </div>
          <div className="justify-self-start lg:justify-self-auto lg:translate-y-[35px]">
            <HoverButton href="tel:+17144408053" variant="red">
              Call (714) 440-8053
            </HoverButton>
          </div>
        </div>
      </section>
    </>
  );
}
