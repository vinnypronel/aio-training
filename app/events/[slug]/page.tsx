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

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({ where: { slug } });
  if (!event) notFound();

  return (
    <section className="bg-aio-black pt-28 pb-20 text-white md:pt-32">
      <div data-reveal-group className="mx-auto grid max-w-[1280px] gap-10 px-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div data-reveal="fade" className="relative border border-aio-line bg-aio-panel p-2">
          <Image
            src={event.flyer}
            alt={`${event.title} flyer`}
            width={600}
            height={750}
            className="h-auto w-full object-contain"
          />
        </div>
        <div>
          <p data-reveal className="text-xs font-black uppercase tracking-[0.24em] text-aio-red">
            {event.badge}
          </p>
          <h1 data-reveal className="mt-4 font-brand-display text-[clamp(2.5rem,5.5vw,5rem)] font-black uppercase leading-[0.95]">
            {event.title}
          </h1>
          <dl data-reveal className="mt-8 space-y-4">
            {[
              ["Date", event.date],
              ["Location", event.location],
              ["Price", event.price],
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
          <div data-reveal className="mt-8 flex flex-col gap-3 sm:flex-row">
            <HoverButton href="tel:+17144408053">Call To Reserve</HoverButton>
            <HoverButton href="/events" variant="outline">
              Back To Events
            </HoverButton>
          </div>
        </div>
      </div>
    </section>
  );
}
