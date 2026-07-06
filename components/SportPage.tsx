import Image from "next/image";
import HoverButton from "@/components/HoverButton";
import { ReactNode } from "react";

type SportPillar = {
  number: string;
  title: string;
  body: string;
};

type SportTier = {
  number: string;
  ageLabel: string;
  title: string;
  body: string;
  callout?: string;
};

type SportProgram = {
  programLabel: string;
  programTitle: string;
  description: string;
  scope: string;
  serviceArea: string;
  tags: string[];
  ctaLabel: string;
  tagLabel?: string;
  programName?: string;
};

export default function SportPage({
  sport,
  heroImage,
  heroImageAlt,
  heroLineOne,
  heroLineTwo,
  heroBlurb,
  introLabel,
  introTitle,
  introBody,
  pillars,
  tiers,
  tiersIntro,
  tiersLabel,
  tiersTitle,
  tiersLight,
  program,
  ctaWordmark,
  ctaTitle,
  ctaBlurb,
  heroImagePosition = "object-center",
  ctaWordmarkClassName,
}: {
  sport: string;
  heroImage: string;
  heroImageAlt: string;
  heroLineOne: string;
  heroLineTwo: string;
  heroBlurb: string;
  introLabel: string;
  introTitle: ReactNode;
  introBody: string;
  pillars: SportPillar[];
  tiers: SportTier[];
  tiersIntro: string;
  tiersLabel?: string;
  tiersTitle?: string;
  tiersLight?: boolean;
  program: SportProgram;
  ctaWordmark: string;
  ctaTitle: ReactNode;
  ctaBlurb: string;
  heroImagePosition?: string;
  ctaWordmarkClassName?: string;
}) {
  return (
    <>
      <section className="relative -mt-20 flex h-[calc(100svh/var(--dz,1))] min-h-[560px] items-center overflow-hidden bg-aio-black text-white lg:-mt-24">
        <Image
          src={heroImage}
          alt={heroImageAlt}
          fill
          priority
          sizes="100vw"
          className={`object-cover ${heroImagePosition}`}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[image:var(--aio-hero-gradient)] opacity-95 mix-blend-multiply"
        />
        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-6 pt-24 lg:pt-32">
          <div className="mb-6 h-1 w-16 -skew-x-[18deg] bg-aio-red" />
          <p className="hero-item mb-5 text-xs font-black uppercase tracking-[0.28em] text-aio-red">
            {sport}
          </p>
          <h1 className="hero-item max-w-[920px] font-brand-display text-balance text-[clamp(3rem,9vw,7.5rem)] font-black uppercase leading-[0.88] drop-shadow-[0_7px_24px_rgba(0,0,0,0.55)]" style={{ animationDelay: "120ms" }}>
            <span>{heroLineOne}</span>{" "}
            <span className="mt-2 block text-aio-red drop-shadow-[0_10px_28px_rgba(255,0,0,0.22)]">
              {heroLineTwo}
            </span>
          </h1>
          <p className="hero-item mt-7 max-w-[680px] text-base font-semibold leading-8 text-white md:text-lg" style={{ animationDelay: "260ms" }}>
            {heroBlurb}
          </p>
          <div className="hero-item mt-9 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "400ms" }}>
            <HoverButton href="/booking">
              Book Your Session
            </HoverButton>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-aio-paper py-20 text-aio-ink md:py-24">
        <div aria-hidden className="pointer-events-none absolute inset-0 mx-auto max-w-[1280px]">
          <span className={`absolute right-0 top-1/2 -translate-y-1/2 select-none font-brand-display text-[clamp(8rem,20vw,18rem)] font-black uppercase leading-none text-aio-black/[0.14] ${
            sport.toLowerCase().includes("baseball") ? "lg:translate-x-[180px]" : "lg:translate-x-[160px]"
          }`}>
            AIO
          </span>
        </div>
        <div data-reveal-group className="relative mx-auto max-w-[1280px] px-6 lg:-translate-x-[90px]">
          <div className="mb-6 h-1 w-16 -skew-x-[18deg] bg-aio-red" />
          <p data-reveal className="text-xs font-black uppercase tracking-[0.28em] text-aio-red">
            {introLabel}
          </p>
          <h2 data-reveal className="mt-4 max-w-[1000px] lg:max-w-[1050px] font-brand-display text-[clamp(2.5rem,6vw,5.25rem)] font-black uppercase leading-none">
            {introTitle}
          </h2>
          <p data-reveal className="mt-5 max-w-[760px] lg:max-w-[680px] text-base font-semibold leading-8 text-aio-ink">
            {introBody}
          </p>
        </div>
      </section>

      <section className="bg-aio-black py-16 text-white md:py-24">
        <div className="mx-auto max-w-[1280px] px-6">
          <div data-reveal-group className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p) => (
              <article
                key={p.number}
                data-reveal
                className="relative min-h-[220px] overflow-hidden bg-white p-6 text-aio-ink shadow-[var(--aio-shadow-hard)]"
              >
                <span
                  aria-hidden
                  className="absolute right-0 bottom-0 h-16 w-16 bg-aio-red [clip-path:polygon(100%_0,100%_100%,0_100%)]"
                />
                <div className="relative z-10">
                  <p className="font-brand-display text-5xl font-black leading-none text-aio-ink">
                    {p.number}.
                  </p>
                  <div aria-hidden className="mt-3 mb-6 h-[3px] w-20 -skew-x-[18deg] bg-aio-red" />
                  <h3 className="mt-3 font-brand-display text-2xl font-black uppercase leading-none">
                    {p.title}
                  </h3>
                  <div className="mt-4 text-sm font-semibold leading-7 text-aio-ink">
                    {p.body}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`relative overflow-hidden py-20 md:py-24 ${tiersLight ? "bg-aio-paper text-aio-ink" : "bg-aio-black text-white"}`}>
        <div data-reveal-group className="relative z-10 mx-auto max-w-[1280px] px-6">
          <div className="max-w-[760px]">
            <div className="mb-6 h-1 w-16 -skew-x-[18deg] bg-aio-red" />
            <p data-reveal className="text-xs font-black uppercase tracking-[0.28em] text-aio-red">
              {tiersLabel ?? `${sport} Path`}
            </p>
            <h2 data-reveal className="mt-4 font-brand-display text-[clamp(2.25rem,5vw,4.75rem)] font-black uppercase leading-none">
              {tiersTitle ?? "Athlete Tiers"}
            </h2>
            <p data-reveal className={`mt-5 text-base font-semibold leading-8 ${tiersLight ? "text-aio-ink/70" : "text-aio-body"}`}>
              {tiersIntro}
            </p>
          </div>
          <ol className="relative mt-14 grid gap-5 md:grid-cols-3">
            {tiers.map((t) => (
              <li
                key={t.number}
                data-reveal
                className={`flex flex-col p-8 py-4 ${tiersLight ? "bg-white shadow-[0_4px_24px_rgba(0,0,0,0.08)]" : "border border-aio-line bg-transparent"}`}
              >
                <div className="flex items-start justify-end gap-4">
                  <span
                    aria-hidden
                    className={`shrink-0 font-brand-display text-7xl font-black leading-none ${tiersLight ? "text-aio-red/60" : "text-aio-red-on-dark/60"}`}
                  >
                    {t.number}.
                  </span>
                </div>
                <div className={`h-1 w-12 -skew-x-[18deg] mt-4 ${tiersLight ? "bg-aio-black" : "bg-white"}`} />
                <h3 className="mt-3 font-brand-display text-2xl font-black uppercase leading-tight">
                  {t.title}
                </h3>
                <p className={`mt-4 text-sm font-semibold leading-6 ${tiersLight ? "text-aio-ink" : "text-aio-body"}`}>
                  {t.body}
                </p>
                {t.callout && (
                  <p className="mt-5 border-l-2 border-aio-red pl-3 text-xs font-black uppercase tracking-[0.12em]">
                    {t.callout}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-aio-black py-20 text-white md:py-24">
        <div className="mx-auto max-w-[1280px] px-6">
          <div data-reveal-group className="grid gap-0 border border-aio-line lg:grid-cols-[0.9fr_1.1fr]">
            {/* Mobile-only label above image */}
            <div className="border-l-4 border-b border-l-aio-red border-b-aio-line p-6 lg:hidden">
              <div data-reveal>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-aio-red-on-dark">
                  {program.programName || "AIO Training"}
                </p>
                <h3 className="mt-2 font-brand-display text-3xl font-black uppercase leading-none">
                  {program.programLabel}
                </h3>
              </div>
            </div>
            <div className="relative min-w-0 w-full aspect-[4/3] overflow-hidden border-b lg:border-b-0 lg:border-r border-aio-line bg-aio-black lg:aspect-auto lg:min-h-[560px] isolate webkit-clip-fix">
              <div data-reveal="fade" className="absolute inset-0 h-full w-full">
                <Image
                  src={heroImage}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover object-center"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-aio-black via-aio-black/20 to-transparent"
                />
              </div>
              <div className="absolute right-0 bottom-0 left-0 hidden border-l-4 border-aio-red bg-aio-black/85 p-6 backdrop-blur lg:block">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-aio-red-on-dark">
                  {program.programName || "AIO Training"}
                </p>
                <h3 className="mt-2 font-brand-display text-3xl font-black uppercase leading-none">
                  {program.programLabel}
                </h3>
              </div>
            </div>
            <div className="min-w-0 p-6 md:p-10 lg:py-12 lg:pl-12 lg:pr-12">
              <div data-reveal className="h-full w-full">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-aio-red-on-dark">
                  {program.tagLabel || "Program Coaching"}
                </p>
                <h2 className="mt-4 max-w-[700px] font-brand-display text-[clamp(2.25rem,5vw,4.75rem)] font-black uppercase leading-none lg:max-w-[700px]">
                  {program.programTitle}
                </h2>
                <p className="mt-6 text-base font-semibold leading-8 text-aio-body">
                  {program.description}
                </p>
                <dl className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="border border-aio-line bg-aio-black p-4">
                    <dt className="text-xs font-black uppercase tracking-[0.16em] text-aio-red-on-dark">
                      Program Scope
                    </dt>
                    <dd className="mt-2 text-sm font-black text-white">
                      {program.scope}
                    </dd>
                  </div>
                  <div className="border border-aio-line bg-aio-black p-4">
                    <dt className="text-xs font-black uppercase tracking-[0.16em] text-aio-red-on-dark">
                      Service Area
                    </dt>
                    <dd className="mt-2 text-sm font-black text-white">
                      {program.serviceArea}
                    </dd>
                  </div>
                </dl>
                <div className="mt-8 flex flex-wrap gap-1.5 sm:gap-2">
                  {program.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-aio-line-strong px-2 py-1.5 text-[10px] sm:px-3 sm:py-2 sm:text-xs font-black uppercase whitespace-nowrap"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-8 flex justify-center lg:justify-start">
                  <HoverButton href="/booking" className="w-full whitespace-normal! py-3 text-center sm:w-auto">
                    {program.ctaLabel}
                  </HoverButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-aio-red py-16 text-white md:py-20">
        <p
          aria-hidden
          className={`pointer-events-none absolute cta-watermark font-brand-display text-[clamp(4rem,15vw,12.5rem)] font-black uppercase leading-none text-white/27 lg:-translate-x-[100px] ${ctaWordmarkClassName || ""}`}
        >
          {ctaWordmark}
        </p>
        <div className="relative z-10 mx-auto grid max-w-[1280px] gap-8 px-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div data-reveal-group className="max-w-5xl lg:-translate-x-[120px] transition-transform duration-500">
            <p data-reveal className="text-xs font-black uppercase tracking-[0.24em] text-white">
              Ready To Level Up Your Game?
            </p>
            <h2 data-reveal className="mt-3 font-brand-display text-balance text-[clamp(2.5rem,6vw,5.5rem)] font-black uppercase leading-[0.9]">
              {ctaTitle}
            </h2>
            <p data-reveal className="mt-5 max-w-[660px] text-base font-bold leading-8 text-white">
              {ctaBlurb}
            </p>
          </div>
          <div className="justify-self-start lg:justify-self-auto lg:translate-y-[35px]">
            <HoverButton href="/booking" variant="black">
              Book A Session
            </HoverButton>
          </div>
        </div>
      </section>
    </>
  );
}
