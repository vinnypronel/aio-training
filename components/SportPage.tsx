import Image from "next/image";
import HoverButton from "@/components/HoverButton";

export type SportPillar = {
  number: string;
  title: string;
  body: string;
};

export type SportTier = {
  number: string;
  ageLabel: string;
  title: string;
  body: string;
  callout?: string;
};

export type SportProgram = {
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
}: {
  sport: string;
  heroImage: string;
  heroImageAlt: string;
  heroLineOne: string;
  heroLineTwo: string;
  heroBlurb: string;
  introLabel: string;
  introTitle: string;
  introBody: string;
  pillars: SportPillar[];
  tiers: SportTier[];
  tiersIntro: string;
  tiersLabel?: string;
  tiersTitle?: string;
  tiersLight?: boolean;
  program: SportProgram;
  ctaWordmark: string;
  ctaTitle: string;
  ctaBlurb: string;
}) {
  return (
    <>
      <section className="relative -mt-20 flex h-[100svh] min-h-[560px] items-center overflow-hidden bg-aio-black text-white lg:-mt-24">
        <Image
          src={heroImage}
          alt={heroImageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[image:var(--aio-hero-gradient)] opacity-95 mix-blend-multiply"
        />
        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-6 pt-24 lg:pt-32">
          <div className="mb-6 h-1 w-16 -skew-x-[18deg] bg-aio-red" />
          <p className="mb-5 text-xs font-black uppercase tracking-[0.28em] text-aio-red">
            {sport}
          </p>
          <h1 className="max-w-[920px] font-brand-display text-balance text-[clamp(3rem,9vw,7.5rem)] font-black uppercase leading-[0.88] drop-shadow-[0_7px_24px_rgba(0,0,0,0.55)]">
            <span>{heroLineOne}</span>{" "}
            <span className="mt-2 block text-aio-red drop-shadow-[0_10px_28px_rgba(255,0,0,0.22)]">
              {heroLineTwo}
            </span>
          </h1>
          <p className="mt-7 max-w-[680px] text-base font-semibold leading-8 text-white md:text-lg">
            {heroBlurb}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <HoverButton href="/booking">
              Book Your Session
            </HoverButton>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-aio-paper py-20 text-aio-ink md:py-24">
        <span
          aria-hidden
          className="pointer-events-none absolute right-[calc(2%+20px)] top-1/2 -translate-y-1/2 select-none font-brand-display text-[clamp(8rem,20vw,18rem)] font-black uppercase leading-none text-aio-black/[0.08]"
        >
          AIO
        </span>
        <div className="relative mx-auto max-w-[1280px] px-6 lg:-translate-x-[90px]">
          <div className="mb-6 h-1 w-16 -skew-x-[18deg] bg-aio-red" />
          <p className="text-xs font-black uppercase tracking-[0.28em] text-aio-red">
            {introLabel}
          </p>
          <h2 className="mt-4 max-w-[1000px] font-brand-display text-[clamp(2.5rem,6vw,5.25rem)] font-black uppercase leading-none">
            {introTitle}
          </h2>
          <p className="mt-5 max-w-[760px] text-base font-semibold leading-8 text-aio-ink">
            {introBody}
          </p>
        </div>
      </section>

      <section className="bg-aio-black py-16 text-white md:py-24">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p) => (
              <article
                key={p.number}
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
        <div className="relative z-10 mx-auto max-w-[1280px] px-6">
          <div className="max-w-[760px]">
            <div className="mb-6 h-1 w-16 -skew-x-[18deg] bg-aio-red" />
            <p className="text-xs font-black uppercase tracking-[0.28em] text-aio-red">
              {tiersLabel ?? `${sport} Path`}
            </p>
            <h2 className="mt-4 font-brand-display text-[clamp(2.25rem,5vw,4.75rem)] font-black uppercase leading-none">
              {tiersTitle ?? "Athlete Tiers"}
            </h2>
            <p className={`mt-5 text-base font-semibold leading-8 ${tiersLight ? "text-aio-ink/70" : "text-aio-body"}`}>
              {tiersIntro}
            </p>
          </div>
          <ol className="relative mt-14 grid gap-5 md:grid-cols-3">
            {tiers.map((t) => (
              <li
                key={t.number}
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
                <h3 className="mt-4 font-brand-display text-2xl font-black uppercase leading-tight">
                  {t.title}
                </h3>
                <p className={`mt-4 text-sm font-semibold leading-6 ${tiersLight ? "text-aio-ink/70" : "text-aio-body"}`}>
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
          <div className="grid gap-0 border border-aio-line lg:grid-cols-[0.9fr_1.1fr]">
            {/* Mobile-only label above image */}
            <div className="border-l-4 border-aio-red p-6 lg:hidden">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-aio-red-on-dark">
                {program.programLabel}
              </p>
              <h3 className="mt-2 font-brand-display text-3xl font-black uppercase leading-none">
                {program.programName || "AIO Training"}
              </h3>
            </div>
            <div className="relative min-h-[300px] overflow-hidden border border-aio-line bg-aio-black lg:min-h-[560px]">
              <Image
                src={heroImage}
                alt=""
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover object-center grayscale"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-aio-black via-aio-black/20 to-transparent"
              />
              <div className="absolute right-0 bottom-0 left-0 hidden border-l-4 border-aio-red bg-aio-black/85 p-6 backdrop-blur lg:block">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-aio-red-on-dark">
                  {program.programLabel}
                </p>
                <h3 className="mt-2 font-brand-display text-3xl font-black uppercase leading-none">
                  {program.programName || "AIO Training"}
                </h3>
              </div>
            </div>
            <div className="p-6 md:p-10 lg:py-12 lg:pl-12 lg:pr-12">
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
              <div className="mt-8 flex flex-wrap gap-2">
                {program.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-aio-line-strong px-3 py-2 text-xs font-black uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-8 flex justify-center lg:justify-start">
                <HoverButton href="/booking" className="w-4/5 sm:w-auto">
                  {program.ctaLabel}
                </HoverButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-aio-red py-16 text-white md:py-20">
        <p
          aria-hidden
          className="pointer-events-none absolute cta-watermark font-brand-display text-[clamp(5rem,17vw,14rem)] font-black uppercase leading-none text-white/10"
        >
          {ctaWordmark}
        </p>
        <div className="relative z-10 mx-auto grid max-w-[1280px] gap-8 px-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-[800px] lg:-translate-x-[175px]">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-white">
              Ready To Level Up Your Game?
            </p>
            <h2 className="mt-3 font-brand-display text-balance text-[clamp(2.5rem,6vw,5.5rem)] font-black uppercase leading-[0.9]">
              {ctaTitle}
            </h2>
            <p className="mt-5 max-w-[660px] text-base font-bold leading-8 text-white">
              {ctaBlurb}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <HoverButton href="/booking" variant="black" className="w-full sm:w-auto">
              Book A Session
            </HoverButton>
          </div>
        </div>
      </section>
    </>
  );
}
