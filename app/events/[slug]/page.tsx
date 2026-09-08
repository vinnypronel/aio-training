import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/db";
import HoverButton from "@/components/HoverButton";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({ where: { slug } });
  if (!event) return { title: "Event Not Found | AIO Training" };
  return {
    title: `${event.title} | AIO Training`,
    description: `${event.title} — ${event.date} at ${event.location}.`,
  };
}

const COMBINE_GALLERY_IMAGES = [
  { src: "/assets/images/combine_images/IMG_3862.JPG", alt: "Athletes performing cone drills" },
  { src: "/assets/images/combine_images/IMG_3647.JPG", alt: "Sprint and agility training" },
  { src: "/assets/images/combine_images/IMG_3657.JPG", alt: "Coach instruction during drills" },
  { src: "/assets/images/combine_images/IMG_3693.JPG", alt: "Speed ladder mechanics" },
  { src: "/assets/images/combine_images/IMG_3385.JPG", alt: "Athletes competing on field" },
  { src: "/assets/images/combine_images/IMG_3295.JPG", alt: "Explosive footwork reps" },
];

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({ where: { slug } });
  if (!event) notFound();

  const isArchived =
    event.tag?.toLowerCase().includes("past") ||
    event.tag?.toLowerCase().includes("archive");

  const isCombine = event.slug === "grand-opening-combine";

  return (
    <section className="bg-aio-black pt-28 pb-20 text-white md:pt-32">
      <div data-reveal-group className="mx-auto grid max-w-[1280px] gap-10 px-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div data-reveal="fade" className="relative border-0 bg-transparent p-0 md:border md:border-aio-line md:bg-aio-panel md:p-2">
          <Image
            src={event.flyer}
            alt={`${event.title} flyer`}
            width={600}
            height={750}
            className="h-auto w-full object-contain"
          />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-black uppercase tracking-[0.24em] text-aio-red">
              {event.badge}
            </span>
            {isArchived && (
              <span className="border border-neutral-700 bg-neutral-800/90 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.16em] text-neutral-300">
                Past Event — Concluded
              </span>
            )}
          </div>

          <h1 data-reveal className="mt-4 font-brand-display text-[clamp(2.5rem,5.5vw,5rem)] font-black uppercase leading-[0.95]">
            {event.title}
          </h1>

          {isArchived && (
            <div data-reveal className="mt-6 border-l-2 border-neutral-600 bg-neutral-900/60 p-4 text-xs font-semibold leading-relaxed text-aio-muted">
              This event was completed on {event.date}. For upcoming group clinics or private 1-on-1 development sessions, please contact AIO Training.
            </div>
          )}

          <dl data-reveal className="mt-8 space-y-4">
            {[
              ["Date", event.date],
              ["Location", event.location],
              ["Pricing", event.price],
            ].map(([k, v]) => (
              <div key={k} className="border-l-2 border-aio-red pl-4">
                <dt className="text-[10px] font-black uppercase tracking-[0.2em] text-aio-red-on-dark">
                  {k}
                </dt>
                <dd className="mt-1 text-sm font-semibold leading-snug">
                  {k === "Location" && v.includes(",") ? (
                    <>
                      {v.split(",")[0]},
                      <span className="block text-[0.85em] opacity-85 mt-0.5 font-normal">
                        {v.split(",").slice(1).join(",").trim()}
                      </span>
                    </>
                  ) : (
                    v
                  )}
                </dd>
              </div>
            ))}
          </dl>

          {isCombine && (
            <div data-reveal className="mt-8 border-t border-aio-line pt-6">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-aio-red">
                Tested Combine Events
              </h3>
              <ul className="mt-3 grid grid-cols-2 gap-2 text-xs font-semibold text-neutral-300">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-aio-red rounded-full shrink-0" />
                  40-Yard Dash Timing
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-aio-red rounded-full shrink-0" />
                  Vertical Jump Measurement
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-aio-red rounded-full shrink-0" />
                  5-10-5 Pro Agility Shuttle
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-aio-red rounded-full shrink-0" />
                  Broad Jump &amp; Power Output
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-aio-red rounded-full shrink-0" />
                  Official Combine Stat Card
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 bg-aio-red rounded-full shrink-0" />
                  Free AIO Gear &amp; Merch
                </li>
              </ul>
            </div>
          )}

          <div data-reveal className="mt-8 flex flex-col gap-3 sm:flex-row">
            {isArchived ? (
              <>
                <HoverButton href="/booking">Book Private Training</HoverButton>
                <HoverButton href="/events#past-events" variant="outline">
                  Back To Events
                </HoverButton>
              </>
            ) : (
              <>
                <HoverButton href="tel:+17144408053">Call To Reserve</HoverButton>
                <HoverButton href="/events" variant="outline">
                  Back To Events
                </HoverButton>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Combine Photo Gallery */}
      {isCombine && (
        <div className="mx-auto mt-20 max-w-[1280px] px-6 border-t border-aio-line pt-14">
          <div data-reveal-group>
            <p data-reveal className="text-xs font-black uppercase tracking-[0.24em] text-aio-red">
              Event Highlights
            </p>
            <h2 data-reveal className="mt-2 font-brand-display text-[clamp(2rem,4.5vw,3.5rem)] font-black uppercase leading-none">
              Combine Action Gallery
            </h2>
            <p data-reveal className="mt-3 text-sm font-semibold text-aio-muted max-w-xl">
              Highlights from our athletes testing their speed, agility, and power on the turf at Heavenly Farms Park.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {COMBINE_GALLERY_IMAGES.map((img) => (
                <div
                  key={img.src}
                  data-reveal
                  className="group relative aspect-[4/3] overflow-hidden border border-aio-line bg-aio-panel"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover object-center transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100 flex items-end p-4">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      {img.alt}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
