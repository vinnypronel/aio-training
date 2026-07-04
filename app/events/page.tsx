import Image from "next/image";
import HoverButton from "@/components/HoverButton";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import AddEventForm from "./AddEventForm";
import CallCTAButton from "./CallCTAButton";
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
      <section className="relative flex h-[90svh] items-center overflow-hidden bg-aio-black pt-24 text-white">
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
          <p className="mt-3 text-xs font-black uppercase tracking-[0.28em] text-aio-red">
            Train with the best, All In One place
          </p>
          <h1 className="mt-4 font-brand-display text-[clamp(2.75rem,7vw,6rem)] font-black uppercase leading-[0.9]">
            Upcoming<br />
            <span className="text-aio-red">Events</span>
          </h1>
          {firstEvent ? (
            <>
              <p className="mt-5 max-w-[680px] text-base font-semibold leading-8 text-aio-body md:text-lg">
                Check out our upcoming events and register before spots fill up.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
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
        <div className="mx-auto max-w-[1280px] px-6">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-aio-red-on-dark">
            Upcoming Events
          </p>
          <h2 className="mt-3 font-brand-display text-[clamp(2.25rem,5vw,4.5rem)] font-black uppercase leading-none">
            Reserve From<br className="lg:hidden" /> The Board.
          </h2>
          <div aria-hidden className="mt-4 h-px w-full bg-aio-line" />
          <p className="mt-4 text-sm font-bold uppercase tracking-[0.12em] text-aio-muted">
            Showing {events.length} event{events.length !== 1 ? "s" : ""}
          </p>

          {events.length > 0 ? (
            <div className="mx-auto mt-10 grid max-w-[900px] gap-6 sm:grid-cols-2 sm:[&>*:only-child]:col-span-2">
              {events.map((event) => (
                <EventCard key={event.id} event={event} isAdmin={isAdmin} />
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

      <section className="relative overflow-hidden bg-aio-red py-16 text-white md:py-20">
        <p
          aria-hidden
          className="pointer-events-none absolute right-10 top-1/2 -translate-y-1/2 -mt-[75px] text-right font-brand-display text-[clamp(5rem,17vw,14rem)] font-black uppercase leading-none text-white/10"
        >
          Events
        </p>
        <div className="relative z-10 mx-auto grid max-w-[1280px] gap-8 px-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-[800px]">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-white">
              Questions?
            </p>
            <h2 className="mt-3 font-brand-display text-[clamp(2.5rem,6vw,5.5rem)] font-black uppercase leading-[0.9]">
              Call Before<br />You Reserve.
            </h2>
            <p className="mt-5 max-w-[660px] text-sm font-semibold leading-relaxed text-white">
              Use the flyer phone number if you need help choosing the right session.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <CallCTAButton />
          </div>
        </div>
      </section>
    </>
  );
}
