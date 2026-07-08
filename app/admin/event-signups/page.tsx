import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import BookingRow from "../bookings/BookingRow";

export const metadata = { title: "Event Sign Ups | Admin | AIO Training" };
export const dynamic = "force-dynamic";

export default async function AdminEventSignupsPage() {
  const session = await getSession();
  if (!session) redirect("/admin");

  const [events, signups] = await Promise.all([
    prisma.event.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.booking.findMany({
      where: { type: "event" },
      include: { customer: true, timeSlot: true, event: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  // Group registrations by event. A booking whose event was deleted lands in the
  // "unassigned" bucket so it is never silently dropped.
  const byEvent = new Map<string, typeof signups>();
  for (const b of signups) {
    const key = b.eventId ?? "unassigned";
    const list = byEvent.get(key) ?? [];
    list.push(b);
    byEvent.set(key, list);
  }

  const unassigned = byEvent.get("unassigned") ?? [];

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
              Event Sign Ups
            </h1>
            <p className="mt-2 text-xs font-semibold text-aio-muted">
              Everyone registered for each event. Training time requests are under
              Booking Requests.
            </p>
          </div>
          <Link
            href="/admin/dashboard"
            className="border border-white/35 px-5 py-2.5 text-xs font-black uppercase tracking-[0.1em] text-white transition hover:border-aio-red hover:text-aio-red"
          >
            Dashboard
          </Link>
        </div>

        {signups.length === 0 ? (
          <p className="mt-10 text-sm font-semibold text-aio-muted">
            No event sign ups yet. Registrations will show up here as people
            check out.
          </p>
        ) : (
          <div className="mt-10 space-y-12">
            {events.map((event) => {
              const list = byEvent.get(event.id) ?? [];
              return (
                <div key={event.id}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-aio-line pb-3">
                    <h2 className="font-brand-display text-xl font-black uppercase text-white md:text-2xl">
                      {event.title}
                    </h2>
                    <span className="text-xs font-black uppercase tracking-[0.12em] text-aio-red-on-dark">
                      {list.length} sign up{list.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  {list.length === 0 ? (
                    <p className="mt-4 text-sm font-semibold text-aio-muted">
                      No sign ups for this event yet.
                    </p>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {list.map((booking) => (
                        <BookingRow key={booking.id} booking={booking} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {unassigned.length > 0 && (
              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-aio-line pb-3">
                  <h2 className="font-brand-display text-xl font-black uppercase text-white md:text-2xl">
                    Other / Past Events
                  </h2>
                  <span className="text-xs font-black uppercase tracking-[0.12em] text-aio-muted">
                    {unassigned.length} sign up{unassigned.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  {unassigned.map((booking) => (
                    <BookingRow key={booking.id} booking={booking} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
