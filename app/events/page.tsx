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

  const upcomingEvents = events.filter((e) => {
    const t = (e.tag || "").toLowerCase();
    return !t.includes("past") && !t.includes("archive");
  });

  const pastEvents = events.filter((e) => {
    const t = (e.tag || "").toLowerCase();
    return t.includes("past") || t.includes("archive");
  });

  const firstUpcoming = upcomingEvents[0];

  return (
    <>
      <section className="relative flex min-h-[580px] h-[calc(90svh/var(--dz,1))] items-start sm:items-center overflow-hidden bg-aio-black text-white lg:pt-16">
        <Image
          src="/assets/images/combine_images/IMG_3862.JPG"
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
        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-6 pt-24 pb-8 sm:py-20">
          <div className="hero-item mt-1 sm:mt-3 flex items-center gap-2.5 text-xs font-black uppercase tracking-[0.28em] text-aio-red">
            <svg className="h-3.5 w-2 text-white shrink-0" fill="none" viewBox="0 0 10 20" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 2H2v16h6" />
            </svg>
            <span>Train with the best, All In One place</span>
            <svg className="h-3.5 w-2 text-white shrink-0" fill="none" viewBox="0 0 10 20" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2 2h6v16H2" />
            </svg>
          </div>
          <h1 className="hero-item mt-4 font-brand-display text-[clamp(2.75rem,7vw,6rem)] font-black uppercase leading-[0.9]" style={{ animationDelay: "120ms" }}>
            {firstUpcoming ? (
              <>
                Upcoming<br />
                <span className="text-aio-red">Events</span>
              </>
            ) : (
              <>
                AIO<br />
                <span className="text-aio-red">Events</span>
              </>
            )}
          </h1>
          {firstUpcoming ? (
            <>
              <p className="hero-item mt-5 max-w-[680px] text-base font-semibold leading-8 text-aio-body md:text-lg" style={{ animationDelay: "260ms" }}>
                Check out our upcoming events and register before spots fill up.
              </p>
              <div className="hero-item mt-7 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "400ms" }}>
                <HoverButton href={`/events/${firstUpcoming.slug}#register`}>
                  Reserve Your Spot
                </HoverButton>
                <HoverButton href={`/events/${firstUpcoming.slug}`} variant="outline">
                  View Event Details
                </HoverButton>
              </div>
            </>
          ) : (
            <>
              <p className="hero-item mt-4 max-w-[680px] text-sm sm:text-base font-semibold leading-relaxed sm:leading-8 text-aio-body md:text-lg" style={{ animationDelay: "260ms" }}>
                New clinics, combines, and skill sessions are announced throughout the year. Explore our past events below or book private and small-group training.
              </p>
              <div className="hero-item mt-5 sm:mt-7 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "400ms" }}>
                <HoverButton href="/booking">
                  Book Training Session
                </HoverButton>
                <HoverButton href="#past-events" variant="outline">
                  Explore Past Events
                </HoverButton>
              </div>
            </>
          )}

        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="bg-aio-black pt-10 pb-16 md:pt-14 md:pb-20 overflow-hidden">
        <div data-reveal-group className="mx-auto max-w-[1280px] px-6">
          <div>
            <h2 data-reveal className="font-brand-display text-[clamp(2.25rem,5vw,4.5rem)] font-black uppercase leading-none">
              Reserve From<br className="lg:hidden" /> The Board.
            </h2>
            {pastEvents.length > 0 && (
              <div className="mt-3">
                <a
                  href="#past-events"
                  className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-aio-red hover:text-white transition"
                >
                  <span>Jump to Past Events ({pastEvents.length})</span>
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </a>
              </div>
            )}
          </div>
          <div aria-hidden className="mt-4 h-px bg-aio-line lg:mx-[-30px]" />

          {upcomingEvents.length > 0 ? (
            <>
              <p data-reveal className="mt-4 text-sm font-bold uppercase tracking-[0.12em] text-aio-muted">
                Showing {upcomingEvents.length} upcoming event{upcomingEvents.length !== 1 ? "s" : ""}
              </p>
              <div className="mx-auto mt-6 lg:mt-8 flex w-full flex-col gap-6 lg:gap-8">
                {upcomingEvents.map((event) => (
                  <div key={event.id} data-reveal className="border-b border-aio-line pb-5 lg:pb-12 lg:mx-[-30px] lg:px-[30px]">
                    <EventCard event={event} isAdmin={isAdmin} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div data-reveal className="mt-8 border border-aio-line bg-aio-panel/60 p-8 sm:p-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="max-w-xl">
                  <h3 className="font-brand-display text-2xl sm:text-3xl font-black uppercase text-white">
                    Stay Tuned For New Clinics &amp; Combines
                  </h3>
                  <p className="mt-2 text-sm font-semibold leading-relaxed text-aio-muted">
                    We are finalizing dates for our upcoming football combines, sport-specific clinics, and group camps. Follow us on Instagram or get in touch today to request private training.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
                  <HoverButton href="/booking" className="!min-h-11 px-6 text-xs">
                    Book Private Training
                  </HoverButton>
                  <HoverButton href="/contact-us" variant="outline" className="!min-h-11 px-6 text-xs">
                    Contact Us
                  </HoverButton>
                </div>
              </div>
            </div>
          )}

          {isAdmin && (
            <div className="mt-12">
              <AddEventForm />
            </div>
          )}
        </div>
      </section>

      {/* Past Events Section */}
      {pastEvents.length > 0 && (
        <section id="past-events" className="border-t border-aio-line bg-[#0e0e0e] pt-12 pb-20 md:pt-16 md:pb-24 overflow-hidden scroll-mt-20">
          <div data-reveal-group className="mx-auto max-w-[1280px] px-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <h2 data-reveal className="font-brand-display text-[clamp(2.25rem,5vw,4.5rem)] font-black uppercase leading-none text-white">
                  Past Events &amp;<br className="lg:hidden" /> Combines.
                </h2>
              </div>
              <p data-reveal className="text-xs font-black uppercase tracking-[0.14em] text-aio-muted">
                Showing {pastEvents.length} archived event{pastEvents.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div aria-hidden className="mt-4 h-px bg-aio-line lg:mx-[-30px]" />
            <p data-reveal className="mt-4 max-w-[680px] text-sm font-semibold leading-relaxed text-aio-muted">
              Explore previous All In One Training events, clinics, and football combines held across Central NJ. Click on any event to view the full flyer or recap details.
            </p>

            <div className="mx-auto mt-8 lg:mt-10 flex w-full flex-col gap-8 lg:gap-10">
              {pastEvents.map((event) => (
                <div key={event.id} data-reveal className="border-b border-aio-line pb-6 lg:pb-12 lg:mx-[-30px] lg:px-[30px]">
                  <EventCard event={event} isAdmin={isAdmin} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="relative overflow-hidden bg-aio-red py-16 text-white md:py-20">
        <div aria-hidden className="pointer-events-none absolute inset-0 mx-auto max-w-[1280px]">
          <p className="absolute right-[30px] lg:right-[-130px] bottom-0 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2 lg:-mt-[75px] text-right font-brand-display text-[clamp(5rem,17vw,14rem)] font-black uppercase leading-none text-white/23 -translate-y-[11px] lg:-translate-y-1/2">
            Events
          </p>
        </div>
        <div className="relative z-10 mx-auto grid max-w-[1280px] gap-8 px-6 -translate-y-[34px] lg:translate-y-0 lg:grid-cols-[1fr_auto] lg:items-end">
          <div data-reveal-group className="max-w-[800px] lg:-translate-x-[130px] transition-transform duration-500">
            <p data-reveal className="text-xs font-black uppercase tracking-[0.24em] text-white">
              Questions?
            </p>
            <h2 data-reveal className="mt-3 font-brand-display text-[clamp(2.5rem,6vw,5.5rem)] font-black uppercase leading-[0.9]">
              Call Before<br /><span className="text-black">You Reserve.</span>
            </h2>
            <p data-reveal className="mt-5 max-w-[660px] text-sm font-semibold leading-relaxed text-white">
              Use the flyer phone number if you need help choosing the right session.
            </p>
          </div>
          <div className="justify-self-start lg:justify-self-auto lg:translate-y-[35px]">
            <HoverButton href="tel:+17144408053" variant="black">
              Call (714) 440-8053
            </HoverButton>
          </div>
        </div>
      </section>
    </>
  );
}
