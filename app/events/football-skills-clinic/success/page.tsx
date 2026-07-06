import Link from "next/link";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";

export const metadata = {
  title: "Registration Confirmed | AIO Football Skills Clinic",
};

export default async function ClinicSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const params = await searchParams;
  const sessionId = params.session_id;

  let customerEmail = "";
  let amountTotal = 0;
  let confirmed = false;

  if (sessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      customerEmail = session.customer_email || session.customer_details?.email || "";
      amountTotal = session.amount_total || 0;

      // Trust only the booking id Stripe stored in the session's own metadata,
      // never a value passed in the URL — otherwise a paid session URL could be
      // replayed to confirm arbitrary unpaid bookings.
      const metaBookingId = session.metadata?.bookingId;
      if (session.payment_status === "paid" && metaBookingId) {
        await prisma.booking.update({
          where: { id: metaBookingId },
          data: { status: "confirmed" },
        });
        confirmed = true;
      }
    } catch {
      // session retrieval failed — still show success UI
    }
  }

  const totalFormatted =
    amountTotal > 0
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amountTotal / 100)
      : "";

  return (
    <section className="min-h-[calc(100svh/var(--dz,1))] bg-aio-black pt-28 pb-20 text-white md:pt-32">
      <div data-reveal-group className="mx-auto max-w-[640px] px-6 text-center">
        {/* Check icon */}
        <div data-reveal className="mx-auto flex h-20 w-20 items-center justify-center border border-emerald-500/30 bg-emerald-500/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="h-10 w-10 text-emerald-400"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>

        <div data-reveal className="mt-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-aio-red">
            {confirmed ? "Payment Confirmed" : "Registration Received"}
          </p>
          <h1 className="mt-4 font-brand-display text-[clamp(2rem,6vw,3.5rem)] font-black uppercase leading-[0.95]">
            You&apos;re{" "}
            <span className="text-emerald-400">Registered.</span>
          </h1>

          <div className="mt-8 border border-aio-line p-6 text-left">
            <p className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-aio-muted">
              Registration Details
            </p>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-semibold text-aio-body">Event</span>
                <span className="text-sm font-black text-white">AIO Football Skills Clinic</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-semibold text-aio-body">Dates</span>
                <span className="text-sm font-black text-white">July 25–26, 2026</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-semibold text-aio-body">Location</span>
                <span className="text-sm font-black text-white">Heavenly Farms Park, East Brunswick</span>
              </div>
              {customerEmail && (
                <div className="flex justify-between">
                  <span className="text-sm font-semibold text-aio-body">Confirmation sent to</span>
                  <span className="text-sm font-black text-white">{customerEmail}</span>
                </div>
              )}
              {totalFormatted && (
                <div className="flex justify-between border-t border-aio-line pt-3">
                  <span className="text-sm font-black text-white">Amount Paid</span>
                  <span className="font-brand-display text-xl font-black text-emerald-400">
                    {totalFormatted}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 border border-aio-line p-5 text-left">
            <p className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-aio-red">
              What Happens Next
            </p>
            <ul className="mt-4 space-y-3">
              {[
                "AIO will reach out to confirm your spot and share check-in details.",
                "Bring cleats, athletic wear, and a water bottle both days.",
                "Check in 15 minutes before the start time each evening.",
                "Questions? Call (714) 440-8053.",
              ].map((item) => (
                <li key={item} className="flex gap-3 text-sm font-semibold leading-relaxed text-aio-body">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-aio-red" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div data-reveal className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/events"
            className="inline-flex min-h-12 items-center justify-center bg-aio-red px-8 text-xs font-black uppercase tracking-[0.1em] text-white transition hover:bg-aio-red-hover"
          >
            Back to Events
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center border border-aio-line px-8 text-xs font-black uppercase tracking-[0.1em] text-white transition hover:border-white"
          >
            Home
          </Link>
        </div>
      </div>
    </section>
  );
}
