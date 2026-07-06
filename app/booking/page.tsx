import Image from "next/image";
import { prisma } from "@/lib/db";
import BookingForm from "./BookingForm";

export const metadata = { title: "Book A Session | AIO Training" };
export const dynamic = "force-dynamic";

export default async function BookingPage() {
  // Use the venue's local calendar date (Eastern) so evening slots don't vanish
  // when the server's UTC clock has already rolled over to tomorrow.
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "America/New_York",
  });

  const slots = await prisma.timeSlot.findMany({
    where: {
      date: { gte: today },
    },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });

  const availableSlots = slots
    .filter((s) => s.bookedCount < s.maxCapacity)
    .map((s) => ({
      id: s.id,
      date: s.date,
      startTime: s.startTime,
      endTime: s.endTime,
      type: s.type,
      title: s.title,
      spotsLeft: s.maxCapacity - s.bookedCount,
    }));

  return (
    <section className="relative min-h-[calc(100svh/var(--dz,1))] overflow-hidden bg-aio-black px-6 py-20 text-white md:py-24">
      {/* Dimmed photographic underlay, faded into black toward the form */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[calc(90vh/var(--dz,1))] min-h-[560px]">
        <Image
          src="/assets/images/booking-bg.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-top opacity-[0.14]"
        />
        <div className="absolute inset-0 bg-[image:var(--aio-hero-gradient)] opacity-95 mix-blend-multiply" />
        <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-b from-transparent to-aio-black" />
      </div>

      {/* Ghost typography */}
      <div aria-hidden className="pointer-events-none absolute inset-0 mx-auto max-w-[1280px]">
        <p className="absolute left-0 top-16 select-none whitespace-nowrap font-brand-display text-[clamp(3.5rem,18vw,16rem)] font-black uppercase leading-none text-white/[0.04] md:top-10">
          Game Day
        </p>
      </div>

      <div data-reveal className="relative z-10 mx-auto max-w-[1280px]">
        <BookingForm slots={availableSlots} />
      </div>
    </section>
  );
}
