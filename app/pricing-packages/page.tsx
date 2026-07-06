import Image from "next/image";
import Link from "next/link";
import HoverButton from "@/components/HoverButton";

export const metadata = {
  title: "Pricing & Packages | AIO Training",
};

type Plan = {
  title: string;
  price: string;
  unit: string;
  body: string;
  bullets: string[];
  featured?: boolean;
  savings?: string;
};

const dropIn: Plan[] = [
  {
    title: "Private",
    price: "$60",
    unit: "per athlete",
    body: "One-on-one athlete development session.",
    bullets: ["60 minute session", "Focused coach attention", "Mechanical detail"],
    featured: true,
  },
  {
    title: "Small Group",
    price: "$40",
    unit: "per athlete",
    body: "Competitive reps with a focused training group.",
    bullets: ["3-6 athletes", "60 minute session", "High-rep competitive environment"],
  },
  {
    title: "Large Group",
    price: "$20",
    unit: "per athlete",
    body: "Broader skill work for larger athlete groups.",
    bullets: ["7-12 athletes", "60-75 minute session", "Skill stations and situational drills"],
  },
];

const packs: Plan[] = [
  {
    title: "3 Pack",
    price: "$165",
    unit: "package",
    body: "Three private training sessions for a focused short block.",
    bullets: ["Private training focus", "Program continuity", "Coach feedback"],
    savings: "Save $15",
  },
  {
    title: "5 Pack",
    price: "$250",
    unit: "package",
    body: "Five private training sessions for athletes building consistency.",
    bullets: ["Most consistent private option", "Skill plus strength focus", "Progress checkpoints"],
    savings: "Save $50",
    featured: true,
  },
  {
    title: "10 Pack",
    price: "$450",
    unit: "package",
    body: "Ten private training sessions for a longer development block.",
    bullets: ["Extended training block", "Season planning", "90-day expiration"],
    savings: "Save $150",
  },
];

const subscriptions: Plan[] = [
  {
    title: "Starter Plan",
    price: "$140",
    unit: "per month",
    body: "1x/week Small Group Training plan.",
    bullets: ["1x/week Small Group Training only", "Routine weekly rhythm"],
    savings: "Save $20",
  },
  {
    title: "Standard Plan",
    price: "$240",
    unit: "per month",
    body: "2x/week Small Group Training plan.",
    bullets: ["2x/week Small Group Training only", "Consistent development"],
    savings: "Save $80",
    featured: true,
  },
];

export default function PricingPackagesPage() {
  return (
    <>
      <section className="relative -mt-20 flex h-[calc(100svh/var(--dz,1))] min-h-[560px] items-center overflow-hidden bg-aio-black text-white lg:-mt-24">
        <Image
          src="/assets/images/pricing-hero-athlete-huddle.webp"
          alt="Athletes huddled around their coach"
          fill
          priority
          sizes="100vw"
          className="object-cover object-bottom"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[image:var(--aio-hero-gradient)] opacity-95 mix-blend-multiply"
        />
        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-6 pt-24 lg:pt-32">
          <div className="h-1 w-12 -skew-x-[18deg] bg-aio-red" />
          <p className="hero-item mt-3 text-xs font-black uppercase tracking-[0.28em] text-aio-red">
            Pricing And Packages
          </p>
          <h1 className="hero-item mt-4 max-w-[920px] font-brand-display text-[clamp(2.75rem,8vw,6.5rem)] font-black uppercase leading-[0.9]" style={{ animationDelay: "120ms" }}>
            Invest In<br />
            <span className="text-aio-red">Your Game</span>
          </h1>
          <p className="hero-item mt-7 max-w-[680px] text-base font-semibold leading-8 text-white md:text-lg" style={{ animationDelay: "260ms" }}>
            Flexible payment options for private sessions, groups, training packs, monthly small-group plans, and team training.
          </p>
          <div className="hero-item mt-9 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "400ms" }}>
            <HoverButton href="/booking">
              Talk To A Coach
            </HoverButton>
            <HoverButton href="#plans" variant="outline">
              See Plans Below
            </HoverButton>
          </div>
        </div>
      </section>

      <PlanGroup
        id="plans"
        label="Pay As You Go"
        title="Start With The Session Type."
        intro="Drop-in options for individual athletes and group settings."
        plans={dropIn}
        bgClass="bg-aio-paper"
        textClass="text-black"
        cardBg="bg-white"
        cardBorder="border-aio-paper-muted"
        cardText="text-black"
        accent="text-aio-red"
        bodyText="text-black"
      />

      <PlanGroup
        label="Private Training Packs"
        title="Build A Longer Training Block."
        intro="Private training packs help athletes stay with a focused block. 10 packs expire 90 days from purchase."
        plans={packs}
        bgClass="bg-aio-black"
        textClass="text-white"
        cardBg="bg-white"
        cardBorder="border-aio-paper-muted"
        cardText="text-black"
        accent="text-aio-red"
        bodyText="text-white"
        parallaxImg="/assets/images/pricing-parallax-baseball.webp"
      />

      <PlanGroup
        label="Monthly Subscriptions"
        title="Make Training Routine."
        intro="Monthly subscriptions are valid for Small Group Training only."
        plans={subscriptions}
        bgClass="bg-aio-paper"
        textClass="text-black"
        cardBg="bg-white"
        cardBorder="border-aio-paper-muted"
        cardText="text-black"
        accent="text-aio-red"
        bodyText="text-black"
        parallaxImg="/assets/images/pricing-parallax-basketball.webp"
      />

      <section className="relative overflow-hidden bg-aio-black py-14 text-white md:py-16">
        <Image
          src="/assets/images/pricing-parallax-football.webp"
          alt=""
          fill
          sizes="100vw"
          className="pointer-events-none object-cover opacity-[0.15]"
        />
        <div className="relative mx-auto max-w-[1280px] px-6">
          <div data-reveal-group className="grid md:grid-cols-2">
            <div data-reveal className="flex flex-col justify-center border border-aio-line bg-aio-black p-8 md:p-10">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-aio-red">
                Team Training
              </p>
              <h2 className="mt-4 font-brand-display text-[clamp(1.75rem,3.2vw,2.75rem)] font-black uppercase leading-none">
                Unit Cohesion.
              </h2>
            </div>
            <article data-reveal className="flex flex-col bg-white p-6 text-black md:p-8">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-aio-red">
                Team Training
              </p>
              <div className="mt-3 flex items-baseline gap-3">
                <span className="font-brand-display text-5xl md:text-6xl font-black leading-none">
                  $190
                </span>
                <span className="text-xs font-black uppercase tracking-[0.12em] text-aio-muted">
                  per session
                </span>
              </div>
              <p className="mt-3 text-sm font-semibold leading-6 text-black">
                60-75 minute team session for up to 12 athletes.
              </p>
              <ul className="mt-4 space-y-2 text-sm font-semibold leading-6 text-black">
                <li className="flex gap-2">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 bg-aio-red" />
                  <span>Scheduled permitted field or court options, plus availability-dependent partner facilities</span>
                </li>
                <li className="flex gap-2">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 bg-aio-red" />
                  <span>Team speed, conditioning, and sport-specific focus</span>
                </li>
                <li className="flex gap-2">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 bg-aio-red" />
                  <span>Additional athletes are $10/player</span>
                </li>
              </ul>
              <Link
                href="/booking"
                className="mt-6 inline-flex min-h-12 w-full items-center justify-center bg-aio-black px-6 text-sm font-black uppercase tracking-[0.08em] text-white transition hover:bg-aio-black/80"
              >
                Ask About Team Training
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-aio-red py-16 text-white md:py-20">
        <div aria-hidden className="pointer-events-none absolute inset-0 mx-auto max-w-[1280px]">
          <p className="absolute right-[-20px] md:right-[-140px] bottom-0 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:-mt-[75px] text-right font-brand-display text-[clamp(5rem,17vw,14rem)] font-black uppercase leading-none text-white/10">
            Plans
          </p>
        </div>
        <div className="relative z-10 mx-auto flex max-w-[1280px] flex-col gap-6 px-6 md:flex-row md:items-end md:justify-between">
          <div data-reveal-group className="max-w-[760px] md:-translate-x-[200px] transition-transform duration-500">
            <p data-reveal className="text-xs font-black uppercase tracking-[0.24em]">
              Still Have Questions?
            </p>
            <h2 data-reveal className="mt-3 font-brand-display text-[clamp(2.5rem,6vw,5rem)] font-black uppercase leading-[0.9]">
              Talk To A Coach Before You Pick.
            </h2>
            <p data-reveal className="mt-5 max-w-[620px] text-base font-bold leading-8">
              Share the athlete&apos;s sport, age, schedule, and goal so AIO can point you toward the right option.
            </p>
          </div>
          <div className="self-start md:self-auto md:translate-y-[35px]">
            <HoverButton href="/booking" variant="black">
              Talk To A Coach
            </HoverButton>
          </div>
        </div>
      </section>
    </>
  );
}

function PlanGroup({
  id,
  label,
  title,
  intro,
  plans,
  bgClass,
  textClass,
  cardBg,
  cardBorder,
  cardText,
  accent,
  bodyText,
  parallaxImg,
}: {
  id?: string;
  label: string;
  title: string;
  intro: string;
  plans: Plan[];
  bgClass: string;
  textClass: string;
  cardBg: string;
  cardBorder: string;
  cardText: string;
  accent: string;
  bodyText: string;
  parallaxImg?: string;
}) {
  return (
    <section
      id={id}
      className={`relative overflow-hidden ${bgClass} py-14 ${textClass} md:py-16 scroll-mt-20 lg:scroll-mt-24`}
    >
      {parallaxImg && (
        <Image
          src={parallaxImg}
          alt=""
          fill
          sizes="100vw"
          className="pointer-events-none absolute inset-0 object-cover opacity-[0.18]"
        />
      )}
      <div data-reveal-group className="relative mx-auto max-w-[1440px] px-6">
        <p data-reveal className={`text-xs font-black uppercase tracking-[0.28em] ${accent} ${plans.length <= 2 ? "text-center" : ""}`}>
          {label}
        </p>
        <h2 data-reveal className={`mt-3 font-brand-display text-[clamp(1.75rem,3.2vw,2.75rem)] font-black uppercase leading-none ${plans.length <= 2 ? "text-center" : ""}`}>
          {title}
        </h2>
        <p data-reveal className={`mt-3 text-sm font-semibold leading-7 ${bodyText} ${plans.length <= 2 ? "text-center mx-auto max-w-[760px]" : "max-w-[760px]"}`}>
          {intro}
        </p>

        <div className={`mt-7 grid gap-6 md:grid-cols-2 ${plans.length > 2 ? "lg:grid-cols-3" : "mx-auto max-w-[920px]"}`}>
          {plans.map((plan) => (
            <article
              key={plan.title}
              data-reveal
              className={`relative flex flex-col border ${
                plan.featured
                  ? "border-aio-red bg-aio-black text-white shadow-[var(--aio-shadow-hard)]"
                  : `${cardBorder} ${cardBg} ${cardText} shadow-[var(--aio-shadow-hard)]`
              } p-6 md:p-8 transition hover:border-aio-red`}
            >
              {plan.featured && (
                <span className="absolute right-0 top-0 bg-aio-red px-4 py-2 text-[0.65rem] font-black uppercase tracking-[0.18em] text-white">
                  Featured
                </span>
              )}
              
              <h3 className={`text-xs font-black uppercase tracking-[0.18em] ${plan.featured ? "text-aio-red" : accent}`}>
                {plan.title}
              </h3>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-brand-display text-5xl md:text-6xl font-black leading-none">
                  {plan.price}
                </span>
                <span className={`text-[0.65rem] font-black uppercase tracking-[0.15em] self-end pb-1.5 ${plan.featured ? "text-white" : "text-black"}`}>
                  {plan.unit}
                </span>
              </div>

              <p className={`mt-4 text-sm font-semibold leading-6 ${plan.featured ? "text-white" : "text-black"}`}>
                {plan.body}
              </p>

              <ul className="mt-4 space-y-2 text-sm font-semibold leading-6">
                {plan.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-aio-red" />
                    <span className={plan.featured ? "text-white" : "text-black"}>{b}</span>
                  </li>
                ))}
              </ul>

              {plan.savings && (
                <p className={`mt-4 text-xs font-black uppercase tracking-[0.12em] ${plan.featured ? "text-aio-red" : accent}`}>
                  {plan.savings}
                </p>
              )}

              <Link
                href="/booking"
                className={`mt-6 inline-flex min-h-12 items-center justify-center px-6 py-3 text-sm font-black uppercase tracking-[0.1em] text-white transition ${
                  plan.featured
                    ? "bg-aio-red hover:bg-aio-red-hover shadow-[var(--aio-shadow-red)]"
                    : "bg-aio-black hover:bg-aio-panel border border-aio-line"
                }`}
              >
                Ask A Coach
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
