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
    <section className="min-h-screen bg-aio-black px-6 py-20 text-white md:py-24">
      <div className="mx-auto max-w-[1280px]">
        <BookingForm slots={availableSlots} />
      </div>
    </section>
  );
}
