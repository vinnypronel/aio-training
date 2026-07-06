import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";

export const metadata = { title: "Customers | Admin | AIO Training" };
export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const session = await getSession();
  if (!session) redirect("/admin");

  const customers = await prisma.customer.findMany({
    include: {
      bookings: {
        orderBy: { createdAt: "desc" },
        take: 3,
      },
      _count: { select: { bookings: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="min-h-[calc(100svh/var(--dz,1))] bg-aio-black px-6 py-20 text-white md:py-24">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-aio-red">
              Admin Panel
            </p>
            <h1 className="mt-3 font-brand-display text-[clamp(2rem,5vw,3.5rem)] font-black uppercase leading-none">
              Customers
            </h1>
          </div>
          <Link
            href="/admin/dashboard"
            className="border border-white/35 px-5 py-2.5 text-xs font-black uppercase tracking-[0.1em] text-white transition hover:border-aio-red hover:text-aio-red"
          >
            Dashboard
          </Link>
        </div>

        <p className="mt-4 text-sm font-semibold text-aio-muted">
          {customers.length} customer{customers.length !== 1 && "s"}
        </p>

        {customers.length === 0 ? (
          <p className="mt-10 text-sm font-semibold text-aio-muted">
            No customers yet. Customers are created when bookings are made.
          </p>
        ) : (
          <div className="mt-8 space-y-3">
            {customers.map((customer) => (
              <div
                key={customer.id}
                className="border border-aio-line bg-aio-panel p-4 md:p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-black text-white">
                      {customer.name}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-aio-muted">
                      {customer.email}
                      {customer.phone && ` · ${customer.phone}`}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {customer.sport && (
                        <span className="bg-aio-black/60 px-2 py-0.5 text-[0.6rem] font-black uppercase tracking-wider text-aio-body">
                          {customer.sport}
                        </span>
                      )}
                      {customer.ageGroup && (
                        <span className="bg-aio-black/60 px-2 py-0.5 text-[0.6rem] font-black uppercase tracking-wider text-aio-body">
                          Ages {customer.ageGroup}
                        </span>
                      )}
                    </div>
                    {customer.notes && (
                      <p className="mt-2 text-xs font-semibold text-aio-muted italic">
                        {customer.notes}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black uppercase tracking-[0.1em] text-aio-red">
                      {customer._count.bookings} booking
                      {customer._count.bookings !== 1 && "s"}
                    </p>
                    <p className="mt-1 text-[0.6rem] text-aio-muted">
                      Joined{" "}
                      {new Date(customer.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
