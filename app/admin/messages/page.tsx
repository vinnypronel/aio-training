import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { deleteMessage } from "./actions";

export const metadata = { title: "Messages | Admin | AIO Training" };
export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const session = await getSession();
  if (!session) redirect("/admin");

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

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
              Messages
            </h1>
            <p className="mt-2 text-xs font-semibold text-aio-muted">
              Contact form submissions from the site.
            </p>
          </div>
          <Link
            href="/admin/dashboard"
            className="border border-white/35 px-5 py-2.5 text-xs font-black uppercase tracking-[0.1em] text-white transition hover:border-aio-red hover:text-aio-red"
          >
            Dashboard
          </Link>
        </div>

        {messages.length === 0 ? (
          <p className="mt-10 text-sm font-semibold text-aio-muted">
            No messages yet. Contact form submissions will show up here.
          </p>
        ) : (
          <div className="mt-8 space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className="border border-aio-line bg-aio-panel p-4 md:p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-sm font-black text-white">{m.fullName}</p>
                      {m.interestedIn && (
                        <span className="bg-aio-red px-2 py-0.5 text-[0.58rem] font-black uppercase tracking-wider text-white">
                          {m.interestedIn}
                        </span>
                      )}
                      {m.athleteAge && (
                        <span className="border border-aio-line px-2 py-0.5 text-[0.58rem] font-black uppercase tracking-wider text-white/70">
                          Ages {m.athleteAge}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs font-semibold text-white/80">
                      <a
                        href={`mailto:${m.email}`}
                        className="transition hover:text-aio-red-on-dark"
                      >
                        {m.email}
                      </a>
                      {m.phone && (
                        <>
                          {" · "}
                          <a
                            href={`tel:${m.phone}`}
                            className="transition hover:text-aio-red-on-dark"
                          >
                            {m.phone}
                          </a>
                        </>
                      )}
                    </p>
                    {m.message && (
                      <p className="mt-2 whitespace-pre-line text-sm font-semibold text-aio-body">
                        {m.message}
                      </p>
                    )}
                    <p className="mt-2 text-[0.6rem] text-white/60">
                      {new Date(m.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <form action={deleteMessage}>
                    <input type="hidden" name="id" value={m.id} />
                    <button
                      type="submit"
                      className="border border-aio-line px-3 py-1.5 text-xs font-black uppercase text-aio-muted transition hover:border-red-500 hover:text-red-500"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
