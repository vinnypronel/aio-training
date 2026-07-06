import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import CalendarView from "./CalendarView";

export const metadata = { title: "Calendar | Admin | AIO Training" };
export const dynamic = "force-dynamic";

export default async function AdminCalendarPage() {
  const session = await getSession();
  if (!session) redirect("/admin");

  const slots = await prisma.timeSlot.findMany({
    include: { bookings: { include: { customer: true } } },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });

  const serializedSlots = slots.map((s) => ({
    id: s.id,
    date: s.date,
    startTime: s.startTime,
    endTime: s.endTime,
    type: s.type,
    title: s.title,
    maxCapacity: s.maxCapacity,
    bookedCount: s.bookedCount,
    bookings: s.bookings.map((b) => ({ customer: { name: b.customer.name } })),
  }));

  return (
    <section className="min-h-[calc(100svh/var(--dz,1))] bg-aio-black px-6 py-20 text-white md:py-24">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-aio-red">
              Admin Panel
            </p>
            <h1 className="mt-3 font-brand-display text-[clamp(2rem,5vw,3.5rem)] font-black uppercase leading-none">
              Calendar
            </h1>
          </div>
          <Link
            href="/admin/dashboard"
            className="border border-white/35 px-5 py-2.5 text-xs font-black uppercase tracking-[0.1em] text-white transition hover:border-aio-red hover:text-aio-red"
          >
            Dashboard
          </Link>
        </div>

        <CalendarView slots={serializedSlots} />
      </div>
    </section>
  );
}
