import Image from "next/image";
import HoverButton from "@/components/HoverButton";
import FlyerDropdown from "./FlyerDropdown";
import ClinicRegisterForm from "./ClinicRegisterForm";

export const metadata = {
  title: "Football Skills Clinic | AIO Training",
};

const skills = [
  { title: "Speed", body: "Acceleration and top-end mechanics built rep by rep." },
  { title: "Agility", body: "Change-of-direction and reaction work on cones and ladders." },
  { title: "Footwork", body: "Position-specific stance, transition, and release patterns." },
  { title: "Route Running", body: "Stems, breaks, and separation against live competition." },
  { title: "Catching", body: "Hands, tracking, and finishing through contact." },
  { title: "Competition", body: "Live one-on-one reps so athletes compete, not just drill." },
];

export default function FootballSkillsClinicPage() {
  return (
    <>
      <section className="relative max-w-full overflow-x-clip bg-aio-black pt-28 pb-20 text-white md:pt-32">
        {/* Dimmed photographic underlay, pinned fixed behind the page contents */}
        <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
          <Image
            src="/assets/images/clinic-bg.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-top opacity-[0.28]"
          />
          <div className="absolute inset-0 bg-[image:var(--aio-hero-gradient)] opacity-85 mix-blend-multiply" />
          <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-b from-transparent to-aio-black" />
        </div>

        {/* Ghost typography */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-full max-w-[1280px]">
          <p className="absolute right-5 top-6 select-none whitespace-nowrap text-right font-brand-display text-[clamp(5rem,15vw,13rem)] font-black uppercase leading-none text-white/[0.18] md:top-4 lg:translate-x-[200px]">
            Clinic
          </p>
        </div>

        <div className="relative z-10 mx-auto max-w-[1280px] px-6">
          {/* Header Grid */}
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end pb-10">
            <div>
              <p className="hero-item text-xs font-black uppercase tracking-[0.24em] text-aio-red">
                2-Day Summer Clinic
              </p>
              <h1 className="hero-item mt-4 font-brand-display text-[clamp(2.5rem,5.5vw,5rem)] font-black uppercase leading-[0.95] text-white" style={{ animationDelay: "120ms" }}>
                AIO Football<br />Skills Clinic
              </h1>
              <p className="hero-item mt-6 max-w-[680px] text-sm font-semibold leading-relaxed text-aio-body" style={{ animationDelay: "260ms" }}>
                July 25-26, 2026 at Heavenly Farms Park. Speed, agility, footwork, route running, catching, and live competition across two evenings. Limited Spots: Register Now.
              </p>
            </div>
            <div className="hero-item flex flex-col gap-3 sm:flex-row lg:flex-col lg:w-full lg:max-w-[260px] lg:justify-self-end" style={{ animationDelay: "400ms" }}>
              <HoverButton href="#register" className="text-xs tracking-[0.14em]">
                Register Now
              </HoverButton>
              <HoverButton href="/events" variant="outline" className="text-xs tracking-[0.14em]">
                Back to Events
              </HoverButton>
            </div>
          </div>

          {/* Main 2-Column Split Content */}
          <div className="mt-12 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            {/* Left Column */}
            <div className="space-y-10">
              {/* Event Details Grid */}
              <div data-reveal className="border-l-4 border-aio-red pl-6 sm:pl-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="flex items-start gap-3 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden
                      className="h-5 w-5 shrink-0 text-aio-red mt-0.5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 8.25h18M4.5 5.25h15A1.5 1.5 0 0 1 21 6.75v12A1.5 1.5 0 0 1 19.5 20.25h-15A1.5 1.5 0 0 1 3 18.75v-12A1.5 1.5 0 0 1 4.5 5.25Z" />
                    </svg>
                    <div>
                      <span className="block text-[10px] font-black uppercase tracking-[0.25em] text-aio-red-on-dark leading-none">
                        Dates
                      </span>
                      <span className="mt-2 block text-sm font-semibold text-white leading-relaxed">
                        July 25-26, 2026
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden
                      className="h-5 w-5 shrink-0 text-aio-red mt-0.5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <div>
                      <span className="block text-[10px] font-black uppercase tracking-[0.25em] text-aio-red-on-dark leading-none">
                        Time
                      </span>
                      <span className="mt-2 block text-sm font-semibold text-white leading-relaxed">
                        6:00 PM - 8:00 PM both days
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden
                      className="h-5 w-5 shrink-0 text-aio-red mt-0.5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                    <div>
                      <span className="block text-[10px] font-black uppercase tracking-[0.25em] text-aio-red-on-dark leading-none">
                        Location
                      </span>
                      <span className="mt-2 block text-sm font-semibold text-white leading-relaxed">
                        Heavenly Farms Park, East Brunswick, NJ
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                      className="h-5 w-5 shrink-0 text-aio-red mt-0.5"
                    >
                      <circle cx="12" cy="7" r="4.2" />
                      <path d="M4.5 19.5a7.5 7.5 0 0 1 15 0" />
                    </svg>
                    <div>
                      <span className="block text-[10px] font-black uppercase tracking-[0.25em] text-aio-red-on-dark leading-none">
                        Age Groups
                      </span>
                      <span className="mt-2 block text-sm font-semibold text-white leading-relaxed">
                        Ages 8-12 and Ages 13-18. Groups separated by age.
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <HoverButton href="#register" className="text-xs tracking-[0.14em]">
                      Register Now
                    </HoverButton>
                    <HoverButton href="tel:+17144408053" variant="outline" className="text-xs tracking-[0.14em]">
                      Call (714) 440-8053
                    </HoverButton>
                  </div>
                </div>
              </div>

              {/* Pricing Grid */}
              <div data-reveal className="border-l-4 border-aio-red pl-6 sm:pl-8">
                <h3 className="text-xs font-black uppercase tracking-[0.24em] text-aio-red-on-dark">
                  Pricing
                </h3>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <span className="block text-[10px] font-black uppercase tracking-[0.25em] text-aio-red-on-dark leading-none">
                      Early Registration
                    </span>
                    <span className="mt-3 block font-brand-display text-4xl font-black text-aio-red-on-dark leading-none">
                      $100
                    </span>
                    <span className="mt-3 block text-xs font-semibold text-aio-muted leading-none">
                      Through July 18, 2026.
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-black uppercase tracking-[0.25em] text-aio-red-on-dark leading-none">
                      Standard Registration
                    </span>
                    <span className="mt-3 block font-brand-display text-4xl font-black text-white leading-none">
                      $150
                    </span>
                    <span className="mt-3 block text-xs font-semibold text-aio-muted leading-none">
                      From July 19, 2026.
                    </span>
                  </div>
                </div>
              </div>

              {/* What Athletes Work On */}
              <div data-reveal-group className="border-l-4 border-aio-red pl-6 sm:pl-8">
                <h3 data-reveal className="text-xs font-black uppercase tracking-[0.24em] text-aio-red-on-dark">
                  What Athletes Work On
                </h3>
                <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2">
                  {skills.map((s, idx) => (
                    <div key={s.title} data-reveal>
                      <h4 className="font-brand-display text-lg font-black uppercase text-white leading-none">
                        <span className="text-aio-red-on-dark">{String(idx + 1).padStart(2, "0")}.</span> {s.title}
                      </h4>
                      <p className="mt-3 text-xs font-semibold leading-relaxed text-aio-body">
                        {s.body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column */}
            <div className="space-y-6 lg:sticky lg:top-[120px]">
              <div data-reveal>
                <FlyerDropdown />
              </div>

              {/* Good To Know List (Wider Horizontally, Shorter Vertically) */}
              <div data-reveal className="border-l-4 border-aio-red pl-5">
                <h3 className="text-xs font-black uppercase tracking-[0.24em] text-aio-red-on-dark">
                  Good To Know
                </h3>
                <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <span className="block text-[9px] font-black uppercase tracking-[0.2em] text-aio-red-on-dark leading-none">
                      Format
                    </span>
                    <span className="mt-1.5 block text-xs font-semibold text-white leading-normal">
                      2-day summer clinic, both evenings.
                    </span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-black uppercase tracking-[0.2em] text-aio-red-on-dark leading-none">
                      Age Groups
                    </span>
                    <span className="mt-1.5 block text-xs font-semibold text-white leading-normal">
                      Ages 8-12 and Ages 13-18.
                    </span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-black uppercase tracking-[0.2em] text-aio-red-on-dark leading-none">
                      Gear Needed
                    </span>
                    <span className="mt-1.5 block text-xs font-semibold text-white leading-normal">
                      Cleats, athletic wear, and a hydration bottle.
                    </span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-black uppercase tracking-[0.2em] text-aio-red-on-dark leading-none">
                      Check-In
                    </span>
                    <span className="mt-1.5 block text-xs font-semibold text-white leading-normal">
                      15 minutes prior to the start time each day.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reserve A Spot — sits below the pinned area so the flyer releases here */}
          <div id="register" data-reveal className="relative mt-10 border-l-4 border-aio-red py-2 pl-6 sm:pl-8 scroll-mt-28">
            {/* Early rate badge (scaled down for compactness) */}
            <div className="mb-4 sm:absolute sm:top-4 sm:right-4 sm:mb-0 inline-flex items-center gap-2.5 border border-aio-red/80 px-3.5 py-1.5">
              <span className="text-[7.5px] font-black uppercase tracking-[0.2em] text-aio-red leading-none">Early Rate Active</span>
              <span className="font-brand-display text-sm font-black text-white leading-none">
                $100<span className="ml-0.5 text-[9px] font-semibold text-white">/athlete</span>
              </span>
              <span className="text-[7.5px] font-semibold text-white leading-none">Through July 18</span>
            </div>
            <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-aio-red-on-dark leading-none">
              Registration
            </span>
            <h3 className="mt-3 font-brand-display text-4xl sm:text-5xl font-black uppercase text-white leading-none">
              Reserve A Spot.
            </h3>
            <p className="mt-4 text-xs font-semibold leading-relaxed text-aio-body">
              $100 early through July 18, 2026, then $150. Fill in parent info and add each athlete below. AIO will confirm and collect payment.
            </p>
            <div className="mt-8">
              <ClinicRegisterForm />
            </div>
            <p className="mt-6 text-[10px] font-bold text-aio-muted">
              Prefer to reserve by phone?{" "}
              <a
                href="tel:+17144408053"
                className="text-aio-red-on-dark hover:text-white transition"
              >
                Call (714) 440-8053
              </a>
            </p>
          </div>

        </div>
      </section>
    </>
  );
}
