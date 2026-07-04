import Image from "next/image";
import HoverButton from "@/components/HoverButton";

export const metadata = {
  title: "AIO Training | Athlete Development in Central NJ",
  description:
    "All In One Training develops baseball, football, basketball, soccer, and personal training athletes across Middlesex and Monmouth County.",
};

export default function Home() {
  return (
    <>
      <section className="relative -mt-20 flex h-[calc(100svh-0px)] min-h-[560px] items-center justify-center overflow-hidden bg-aio-black text-white lg:-mt-24">
        {/* Background hero video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/assets/images/home-hero-poster.webp"
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover object-center"
        >
          <source src="/assets/videos/home-hero.mp4" type="video/mp4" />
        </video>
        <div
          aria-hidden
          className="absolute inset-0 bg-[image:var(--aio-hero-gradient)] opacity-95 mix-blend-multiply"
        />

        <div className="relative z-10 mx-auto flex w-full max-w-[1280px] flex-col items-center px-6 pt-20 text-center lg:pt-24">
          <div className="mb-6 h-1 w-16 -skew-x-[18deg] bg-aio-red" />
          <p className="mb-4 text-xs font-black uppercase tracking-[0.28em] text-aio-red sm:text-sm">
            All In One Training
          </p>
          <h1 className="max-w-[18ch] font-brand-display text-balance text-[clamp(3rem,8vw,6.5rem)] font-black uppercase leading-[0.92] drop-shadow-[0_7px_24px_rgba(0,0,0,0.55)]">
            <span>Build Your Athlete&apos;s</span>{" "}
            <span className="mt-1 block text-aio-red drop-shadow-[0_10px_28px_rgba(255,0,0,0.22)]">
              Next Level.
            </span>
          </h1>
          <p className="mt-6 max-w-[680px] text-base font-semibold leading-7 text-white sm:text-lg md:leading-8">
            Sport-specific training for baseball, football, basketball, soccer,
            and private athlete development. Parents get a clear plan. Athletes
            get focused reps that carry into the season.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <HoverButton href="/booking" className="min-h-13 px-8 py-3.5 md:text-base">
              Book Your Session
            </HoverButton>
            <HoverButton href="/training-services" variant="outline" className="min-h-13 px-8 py-3.5 bg-aio-black/55 md:text-base">
              Explore Training
            </HoverButton>
          </div>
        </div>
      </section>

      <section className="bg-aio-paper py-20 text-aio-ink md:py-24">
        <div className="mx-auto grid max-w-[1280px] gap-10 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="lg:-translate-x-[75px]">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-aio-red">
              Train with the best, All In One place
            </p>
            <h2 className="mt-4 font-brand-display text-[clamp(1.75rem,4.5vw,3.75rem)] font-black uppercase leading-[0.95]">
              <span className="block md:whitespace-nowrap">Built For Athletes</span>
              <span className="block md:whitespace-nowrap">And The Families</span>
              <span className="block md:whitespace-nowrap">Backing Them.</span>
            </h2>
            <div className="mt-6 space-y-5 text-base font-semibold leading-8 text-aio-ink">
              <p>
                All In One Training works with youth and high school athletes
                across baseball, football, basketball, soccer, and private
                performance training while keeping parents clear on the plan,
                schedule, and next step.
              </p>
              <p>
                Sessions pair sport mechanics with strength, speed, movement
                quality, and the kind of focused repetition that carries into
                practices, games, and tryouts.
              </p>
            </div>
            <HoverButton href="/training-services" className="mt-8">
              Explore Training
            </HoverButton>
          </div>
          <div className="relative min-h-[420px] overflow-hidden border border-aio-paper-muted bg-aio-field shadow-[var(--aio-shadow-hard)] lg:translate-x-[75px] lg:scale-[1.15]">
            <Image
              src="/assets/images/services-football-card.webp"
              alt="Youth football athlete driving a sled on outdoor turf"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-aio-black py-20 text-white md:py-24">
        <div className="mx-auto grid max-w-[1280px] gap-10 px-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div className="lg:order-2 lg:col-start-2 lg:row-start-1 lg:translate-x-[105px]">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-aio-red-on-dark">
              Where We Train
            </p>
            <h2 className="mt-4 font-brand-display text-[clamp(2rem,5vw,4rem)] font-black uppercase leading-[0.95]">
              <span className="block md:whitespace-nowrap">Scheduled Sessions.</span>
              <span className="block md:whitespace-nowrap">Game Transfer.</span>
            </h2>
          </div>

          <div className="relative lg:order-1 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:-translate-x-[55px] lg:-translate-y-[30px] lg:scale-[1.4]">
            <div className="absolute -left-4 -top-4 h-24 w-24 border-l-4 border-t-4 border-aio-red" />
            <div className="absolute -bottom-4 -right-4 h-24 w-24 border-b-4 border-r-4 border-aio-red" />
            <div className="relative aspect-[3/2] w-full overflow-hidden border border-aio-line bg-aio-panel shadow-[var(--aio-shadow-hard)]">
              <Image
                src="/assets/images/home-field-drills.webp"
                alt="Youth football athletes running cone drills on an outdoor field"
                fill
                sizes="(min-width: 1024px) 52vw, 100vw"
                className="object-cover object-center"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-aio-black/20 mix-blend-multiply"
              />
            </div>
          </div>

          <div className="lg:order-3 lg:col-start-2 lg:row-start-2 lg:translate-x-[105px]">
            <div className="space-y-5">
              <TrainingCard
                title="Indoor Sessions"
                tag="Confirmed before each session"
                items={[
                  "Indoor work may use availability-dependent partner facilities when a session calls for it.",
                  "Contact AIO before visiting any training location. Each session is confirmed before arrival.",
                ]}
              />
              <TrainingCard
                title="Permitted Fields And Courts"
                tag="Middlesex and Monmouth County"
                items={[
                  "Outdoor or court work is scheduled at permitted fields and courts when availability fits the training plan.",
                  "Every session location is confirmed with the athlete's schedule before arrival.",
                ]}
              />
            </div>
            <HoverButton href="/booking" className="mt-8">
              Book A Session
            </HoverButton>
          </div>
        </div>
      </section>
    </>
  );
}

function TrainingCard({
  title,
  tag,
  items,
}: {
  title: string;
  tag: string;
  items: string[];
}) {
  return (
    <article className="border border-aio-line p-5 md:p-6">
      <h3 className="font-brand-display text-2xl font-black uppercase leading-none">
        {title}
      </h3>
      <div className="mt-2 text-sm font-black uppercase tracking-[0.08em] text-aio-red-on-dark">
        {tag}
      </div>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-3 text-sm font-semibold leading-7 text-aio-body"
          >
            <span
              aria-hidden
              className="mt-2 h-2.5 w-2.5 shrink-0 bg-aio-red"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
