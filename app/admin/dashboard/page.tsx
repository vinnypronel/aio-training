import Link from "next/link";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { logout } from "../actions";

export const metadata = { title: "Admin Dashboard | AIO Training" };
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/admin");

  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "America/New_York",
  });

  const [newBookings, upcomingSlots, customerCount, eventCount, recentBookings] =
    await Promise.all([
      prisma.booking.count({ where: { status: "new" } }),
      prisma.timeSlot.count({ where: { date: { gte: today } } }),
      prisma.customer.count(),
      prisma.event.count(),
      prisma.booking.findMany({
        include: { customer: true, timeSlot: true, event: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

  return (
    <section className="bg-aio-black px-6 py-20 md:py-24">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-aio-red">
              Admin Panel
            </p>
            <h1 className="mt-3 font-brand-display text-[clamp(2rem,5vw,3.5rem)] font-black uppercase leading-none">
              Dashboard
            </h1>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="border border-white/35 px-5 py-2.5 text-xs font-black uppercase tracking-[0.1em] text-white transition hover:border-aio-red hover:text-aio-red"
            >
              Sign Out
            </button>
          </form>
        </div>

        {/* At-a-glance stats */}
        <div className="mt-10 grid gap-4 grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="New Bookings"
            value={newBookings}
            href="/admin/bookings?status=new"
            highlight={newBookings > 0}
          />
          <StatCard label="Upcoming Slots" value={upcomingSlots} href="/admin/calendar" />
          <StatCard label="Customers" value={customerCount} href="/admin/customers" />
          <StatCard label="Events" value={eventCount} href="/admin/events" />
        </div>

        {/* Management sections */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <DashCard title="Calendar" description="Add time slots for the public to book" href="/admin/calendar" />
          <DashCard title="Bookings" description="View and manage appointments" href="/admin/bookings" />
          <DashCard title="Customers" description="Customer CRM and contact info" href="/admin/customers" />
          <DashCard title="Events" description="Manage upcoming events and flyers" href="/admin/events" />
        </div>

        {/* Recent activity */}
        <div className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="font-brand-display text-xl font-black uppercase">
              Recent Bookings
            </h2>
            <Link
              href="/admin/bookings"
              className="text-xs font-black uppercase tracking-[0.1em] text-aio-red-on-dark transition hover:text-white"
            >
              View All →
            </Link>
          </div>
          {recentBookings.length === 0 ? (
            <p className="mt-4 text-sm font-semibold text-aio-muted">
              No bookings yet. New requests will show up here.
            </p>
          ) : (
            <div className="mt-4 divide-y divide-aio-line border border-aio-line">
              {recentBookings.map((b) => (
                <div
                  key={b.id}
                  className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-black text-white">{b.customer.name}</p>
                    <p className="mt-0.5 text-xs font-semibold text-aio-muted">
                      {b.event
                        ? b.event.title
                        : b.timeSlot
                          ? `${b.timeSlot.date} · ${b.timeSlot.startTime}–${b.timeSlot.endTime}`
                          : b.type}
                    </p>
                  </div>
                  <span
                    className={`self-start px-3 py-1 text-[0.65rem] font-black uppercase tracking-[0.12em] sm:self-auto ${
                      b.status === "new"
                        ? "bg-aio-red text-white"
                        : "border border-aio-line text-aio-muted"
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="mt-8 text-sm font-semibold text-aio-muted">
          Logged in as {session.email}
        </p>
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  href,
  highlight,
}: {
  label: string;
  value: number;
  href: string;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`border p-5 transition hover:border-aio-red ${
        highlight ? "border-aio-red bg-aio-red/10" : "border-aio-line bg-aio-panel"
      }`}
    >
      <p className="font-brand-display text-4xl font-black leading-none text-white">
        {value}
      </p>
      <p className="mt-2 text-xs font-black uppercase tracking-[0.12em] text-aio-muted">
        {label}
      </p>
    </Link>
  );
}

function DashCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="border border-aio-line bg-aio-panel p-6 transition hover:border-aio-red"
    >
      <h2 className="font-brand-display text-xl font-black uppercase">{title}</h2>
      <p className="mt-2 text-sm font-semibold text-aio-body">{description}</p>
    </Link>
  );
}
