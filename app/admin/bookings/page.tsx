import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import BookingRow from "./BookingRow";

export const metadata = { title: "Bookings | Admin | AIO Training" };
export const dynamic = "force-dynamic";

const statusFilters = ["all", "new", "contacted", "confirmed", "completed", "cancelled"];

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/admin");

  const params = await searchParams;
  const filter = params.status || "all";

  // Time-slot / training requests only. Event registrations live under
  // /admin/event-signups so the two intake streams stay separate.
  const notEvent = { type: { not: "event" } };

  const bookings = await prisma.booking.findMany({
    where:
      filter !== "all" ? { AND: [notEvent, { status: filter }] } : notEvent,
    include: {
      customer: true,
      timeSlot: true,
      event: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const counts = await prisma.booking.groupBy({
    by: ["status"],
    where: notEvent,
    _count: { id: true },
  });

  const countMap: Record<string, number> = {};
  let total = 0;
  for (const c of counts) {
    countMap[c.status] = c._count.id;
    total += c._count.id;
  }
  countMap["all"] = total;

  return (
    <section className="min-h-[calc(100svh/var(--dz,1))] bg-aio-black px-6 py-20 text-white md:py-24">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2.5 text-xs font-black uppercase tracking-[0.28em] text-aio-red">
              <svg className="h-3.5 w-2 text-white shrink-0" fill="none" viewBox="0 0 10 20" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 2H2v16h6" />
              </svg>
              <span>Admin Panel</span>
              <svg className="h-3.5 w-2 text-white shrink-0" fill="none" viewBox="0 0 10 20" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2 2h6v16H2" />
              </svg>
            </div>
            <h1 className="mt-3 font-brand-display text-[clamp(2rem,5vw,3.5rem)] font-black uppercase leading-none">
              Booking Requests
            </h1>
            <p className="mt-2 text-xs font-semibold text-aio-muted">
              Training time requests. Event registrations are under Event Sign Ups.
            </p>
          </div>
          <Link
            href="/admin/dashboard"
            className="border border-white/35 px-5 py-2.5 text-xs font-black uppercase tracking-[0.1em] text-white transition hover:border-aio-red hover:text-aio-red"
          >
            Dashboard
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {statusFilters.map((s) => (
            <Link
              key={s}
              href={s === "all" ? "/admin/bookings" : `/admin/bookings?status=${s}`}
              className={`px-4 py-2 text-xs font-black uppercase tracking-[0.1em] transition ${
                filter === s
                  ? "bg-aio-red text-white"
                  : "border border-aio-line text-aio-muted hover:border-aio-red hover:text-white"
              }`}
            >
              {s} ({countMap[s] || 0})
            </Link>
          ))}
        </div>

        {bookings.length === 0 ? (
          <p className="mt-10 text-sm font-semibold text-aio-muted">
            No bookings found.
          </p>
        ) : (
          <div className="mt-8 space-y-3">
            {bookings.map((booking) => (
              <BookingRow key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
