"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import HoverButton from "@/components/HoverButton";

const tracks = [
  {
    href: "/baseball-training",
    title: "Baseball",
    body: "Hitting mechanics, throwing development, fielding detail, and strength work.",
    image: "/assets/images/baseball-hero-batting-cage.webp",
    alt: "Youth baseball athlete swinging in batting cage",
  },
  {
    href: "/football-training",
    title: "Football",
    body: "Position work, speed, agility, collision preparation, and game awareness.",
    image: "/assets/images/football-hero-turf.webp",
    alt: "Youth football athlete sprinting on outdoor turf",
  },
  {
    href: "/basketball-training",
    title: "Basketball",
    body: "Ball handling, shooting mechanics, defensive movement, and court conditioning.",
    image: "/assets/images/basketball-hero-shooting.webp",
    alt: "Youth basketball athlete shooting on outdoor court",
  },
  {
    href: "/soccer-training",
    title: "Soccer",
    body: "First touch, dribbling, passing, 1v1 play, footwork, and game-speed conditioning.",
    image: "/assets/images/soccer-training-hero.webp",
    alt: "Youth soccer athlete on the field",
  },
  {
    href: "/personal-training",
    title: "Personal Training",
    body: "Private coaching for strength, speed, mobility, skill transfer, and confidence.",
    image: "/assets/images/personal-training-hero.webp",
    alt: "Coach working one on one with a youth athlete",
  },
];

const process = [
  {
    number: "01",
    label: "Assess",
    title: "Profile The Athlete",
    body: "Review movement, training age, sport demands, and the next competitive goal.",
  },
  {
    number: "02",
    label: "Program",
    title: "Build The Block",
    body: "Pair technical reps with strength, speed, and readiness work that fits the season.",
  },
  {
    number: "03",
    label: "Progress",
    title: "Adjust The Plan",
    body: "Track execution and shift the work as the athlete adapts.",
  },
];

export default function TrainingServicesPage() {
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoverPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <>
      <title>Training &amp; Services | AIO Training</title>
      <section className="relative -mt-20 flex h-[100svh] min-h-[560px] items-center overflow-hidden bg-aio-black text-white lg:-mt-24">
        <Image
          src="/assets/images/training-services-hero.webp"
          alt="AIO Training athlete sprinting on the field"
          fill
          priority
          sizes="100vw"
          className="-scale-x-100 object-cover object-[center_30%]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[image:var(--aio-hero-gradient)] opacity-95 mix-blend-multiply"
        />
        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-6 pt-24 lg:pt-32">
          <div className="h-1 w-12 -skew-x-[18deg] bg-aio-red" />
          <p className="hero-item mt-3 text-xs font-black uppercase tracking-[0.28em] text-aio-red">
            Training And Services Hub
          </p>
          <h1 className="hero-item mt-4 max-w-[920px] font-brand-display text-balance text-[clamp(2.75rem,8vw,6.5rem)] font-black uppercase leading-[0.9]" style={{ animationDelay: "120ms" }}>
            Where Athletes <span className="text-aio-red">Are Made.</span>
          </h1>
          <p className="hero-item mt-7 max-w-[680px] text-base font-semibold leading-8 text-white md:text-lg" style={{ animationDelay: "260ms" }}>
            Sport-specific developmental programs for youth and high school athletes. Choose the path that matches your athlete&apos;s season and goals.
          </p>
          <div className="hero-item" style={{ animationDelay: "400ms" }}>
            <HoverButton href="#tracks" className="mt-9">
              Find Your Program
            </HoverButton>
          </div>
        </div>
      </section>

      <section id="tracks" className="bg-aio-paper py-20 text-aio-ink md:py-24">
        <div data-reveal-group className="mx-auto max-w-[1600px] px-6">
          <p data-reveal className="text-xs font-black uppercase tracking-[0.28em] text-aio-red">
            Our Services
          </p>
          <h2 data-reveal className="mt-3 font-brand-display text-[clamp(2.25rem,5vw,4.5rem)] font-black uppercase leading-none">
            Pick Your Training Track.
          </h2>
          <p data-reveal className="mt-5 max-w-[720px] text-base font-semibold leading-relaxed text-aio-ink lg:max-w-none lg:whitespace-nowrap">
            Each track keeps the same AIO standard: assess the athlete, program the work, and progress the plan as the season changes.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:-mx-3 sm:grid-cols-3 md:grid-cols-5">
            {tracks.map((t) => (
              <div key={t.href} data-reveal className="group relative aspect-[3/4] transition-transform duration-300 hover:-translate-y-2">
                <Link
                  href={t.href}
                  className="relative flex h-full flex-col justify-end overflow-hidden bg-aio-black p-6 text-white transition [clip-path:polygon(0_0,100%_0,100%_calc(100%-40px),calc(100%-40px)_100%,0_100%)]"
                >
                  <Image
                    src={t.image}
                    alt={t.alt}
                    fill
                    quality={90}
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover object-center grayscale transition duration-500 group-hover:scale-[1.04] group-hover:grayscale-0"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-aio-black via-aio-black/55 to-transparent"
                  />
                  <span aria-hidden className="absolute right-10 bottom-0 h-1 w-14 bg-aio-red" />
                  <span aria-hidden className="absolute right-0 bottom-10 h-14 w-1 bg-aio-red" />

                  <div className="relative z-10">
                    <h3 className="min-h-[2.5rem] font-brand-display text-2xl font-black uppercase leading-[0.95] text-aio-red drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)] sm:text-3xl xl:min-h-[4rem] xl:text-[2rem]">
                      {t.title}
                    </h3>
                    <p className="mt-3 text-[0.78rem] font-semibold leading-5 text-white xl:text-sm xl:leading-6">
                      {t.body}
                    </p>
                    <span className="fill-red-on-hover mt-4 inline-flex items-center text-[0.7rem] font-black uppercase tracking-[0.14em]">
                      Explore Program →
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-aio-black py-20 text-white md:py-24">
        <div data-reveal-group className="mx-auto max-w-[1280px] px-6">
          <p data-reveal className="text-xs font-black uppercase tracking-[0.28em] text-aio-red-on-dark">
            How We Work
          </p>
          <h2 data-reveal className="mt-3 font-brand-display text-[clamp(2.25rem,5vw,4.5rem)] font-black uppercase leading-none">
            Three-Step Method.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {process.map((step) => (
              <article
                key={step.number}
                data-reveal
                className="relative flex min-h-[300px] flex-col justify-between overflow-hidden border border-aio-line p-8 pt-8"
              >
                <span
                  aria-hidden
                  className="absolute top-2 right-4 text-[9rem] font-black leading-none text-white/[0.06]"
                >
                  {step.number}
                </span>

                <div>
                  <p className="text-2xl font-black uppercase tracking-[0.2em] text-aio-red-on-dark">
                    {step.label}
                  </p>
                </div>

                <div className="mt-auto space-y-3">
                  <h3 className="font-brand-display text-3xl font-black uppercase leading-none text-white">
                    {step.title}
                  </h3>
                  <p className="text-base font-semibold leading-7 text-aio-body">
                    {step.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-aio-black py-20 text-white md:py-24 overflow-hidden">
        <div data-reveal-group className="mx-auto grid max-w-[1280px] gap-12 px-6 lg:grid-cols-[1.5fr_1fr] lg:items-center">
          <div className="relative p-6 xl:-translate-x-10 xl:scale-[1.1] xl:origin-left 2xl:-translate-x-20 2xl:scale-[1.2] transition-transform duration-500">
            <div aria-hidden className="absolute left-0 top-0 h-16 w-16 border-l-4 border-t-4 border-aio-red" />
            <div aria-hidden className="absolute right-0 bottom-0 h-16 w-16 border-b-4 border-r-4 border-aio-red" />
            <div data-reveal="fade" className="relative aspect-[16/9] overflow-hidden border border-aio-line bg-aio-panel shadow-[var(--aio-shadow-hard)]">
              <Image
                src="/assets/images/training-services-facility.webp"
                alt="AIO training facility"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="xl:translate-x-6 2xl:translate-x-12 transition-transform duration-500">
            <p data-reveal className="text-xs font-black uppercase tracking-[0.28em] text-aio-red-on-dark">
              Middlesex And Monmouth County
            </p>
            <h2 data-reveal className="mt-3 sm:whitespace-nowrap font-brand-display text-[clamp(2rem,5vw,4rem)] font-black uppercase leading-none">
              Where We Train.
            </h2>
            <div className="mt-8 space-y-5">
              <article data-reveal className="border border-aio-line p-6">
                <h3 className="font-brand-display text-2xl font-black uppercase leading-none">
                  Indoor Training Sessions
                </h3>
                <p className="mt-2 text-xs font-black uppercase tracking-[0.12em] text-aio-red-on-dark">
                  Confirmed before each session
                </p>
                <p className="mt-4 text-sm font-semibold leading-7 text-aio-body">
                  Strength, speed, and group work may use availability-dependent partner facilities. Contact AIO before visiting any training location. Each session location is confirmed before arrival.
                </p>
              </article>
              <article data-reveal className="border border-aio-line p-6">
                <h3 className="font-brand-display text-2xl font-black uppercase leading-none">
                  Permitted Fields And Courts
                </h3>
                <p className="mt-2 text-xs font-black uppercase tracking-[0.12em] text-aio-red-on-dark">
                  Middlesex and Monmouth County
                </p>
                <p className="mt-4 text-sm font-semibold leading-7 text-aio-body">
                  Outdoor transfer work is scheduled at permitted fields and courts when the plan calls for live sport space. Every session location is confirmed with the athlete&apos;s training schedule before arrival.
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-aio-red py-16 text-white md:py-20">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-6 px-6 md:flex-row md:items-end md:justify-between">
          <div data-reveal-group className="max-w-[760px]">
            <p data-reveal className="text-xs font-black uppercase tracking-[0.24em]">
              Not Sure Which Path?
            </p>
            <h2 data-reveal className="mt-3 font-brand-display text-[clamp(2.5rem,6vw,5rem)] font-black uppercase leading-[0.9]">
              <span className="block sm:whitespace-nowrap">Start With A Coach</span>
              <span className="block">Conversation.</span>
            </h2>

            <p data-reveal className="mt-5 max-w-[620px] text-base font-bold leading-8">
              Tell us the athlete&apos;s sport, age, season timing, and goal. AIO will point you toward the right training path.
            </p>
          </div>
          <div className="relative flex flex-col items-center md:items-end">
            <span aria-hidden className="-translate-y-[60px] font-brand-display text-[clamp(8rem,18vw,16rem)] font-black uppercase leading-none text-white/10">
              AIO
            </span>
            <Link
              href="/booking"
              onMouseEnter={() => setIsHovered(true)}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setIsHovered(false)}
              className="relative -mt-8 inline-flex min-h-12 items-center justify-center overflow-hidden bg-aio-black px-6 text-sm font-black uppercase tracking-[0.08em] text-white"
            >
              <span className="relative z-10 mix-blend-difference">Book A Consultation</span>
              <span
                className="pointer-events-none absolute rounded-full bg-white transition-all duration-700 ease-out -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: hoverPos.x,
                  top: hoverPos.y,
                  width: isHovered ? "600px" : "0px",
                  height: isHovered ? "600px" : "0px",
                  mixBlendMode: "difference",
                }}
              />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
