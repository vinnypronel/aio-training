import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { logout } from "../actions";

export const metadata = { title: "Admin Dashboard | AIO Training" };

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/admin");

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

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <DashCard title="Events" description="Manage upcoming events and flyers" href="/admin/events" />
          <DashCard title="Calendar" description="Manage time slots and availability" href="/admin/calendar" />
          <DashCard title="Bookings" description="View and manage appointments" href="/admin/bookings" />
          <DashCard title="Customers" description="Customer CRM and contact info" href="/admin/customers" />
          <DashCard title="Settings" description="Site configuration" href="/admin/settings" disabled />
        </div>

        <p className="mt-8 text-sm font-semibold text-aio-muted">
          Logged in as {session.email}
        </p>
      </div>
    </section>
  );
}

function DashCard({
  title,
  description,
  href,
  disabled,
}: {
  title: string;
  description: string;
  href: string;
  disabled?: boolean;
}) {
  const Tag = disabled ? "div" : "a";
  return (
    <Tag
      {...(disabled ? {} : { href })}
      className={`border border-aio-line bg-aio-panel p-6 transition ${
        disabled
          ? "cursor-not-allowed opacity-40"
          : "hover:border-aio-red"
      }`}
    >
      <h2 className="font-brand-display text-xl font-black uppercase">
        {title}
      </h2>
      <p className="mt-2 text-sm font-semibold text-aio-body">{description}</p>
      {disabled && (
        <p className="mt-3 text-xs font-black uppercase tracking-[0.1em] text-aio-muted">
          Coming Soon
        </p>
      )}
    </Tag>
  );
}
