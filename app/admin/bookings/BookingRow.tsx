"use client";

import { updateBookingStatus, deleteBooking } from "./actions";

type BookingProps = {
  booking: {
    id: string;
    status: string;
    type: string;
    notes: string;
    createdAt: Date;
    customer: { id: string; name: string; email: string; phone: string };
    timeSlot: { date: string; startTime: string; endTime: string; title: string } | null;
    event: { title: string } | null;
  };
};

const statusColors: Record<string, string> = {
  new: "bg-blue-600",
  contacted: "bg-amber-600",
  confirmed: "bg-emerald-600",
  completed: "bg-aio-muted",
  cancelled: "bg-red-600",
};

const typeLabels: Record<string, string> = {
  private: "Private",
  "small-group": "Small Group",
  "large-group": "Large Group",
  event: "Event",
};

const statuses = ["new", "contacted", "confirmed", "completed", "cancelled"];

export default function BookingRow({ booking }: BookingProps) {
  const dateLabel = booking.timeSlot
    ? `${booking.timeSlot.date} · ${booking.timeSlot.startTime}–${booking.timeSlot.endTime}`
    : booking.event
    ? booking.event.title
    : "—";

  return (
    <div className="border border-aio-line bg-aio-panel p-4 md:p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <span
              className={`inline-block px-2 py-0.5 text-[0.6rem] font-black uppercase tracking-wider text-white ${
                statusColors[booking.status] || "bg-aio-muted"
              }`}
            >
              {booking.status}
            </span>
            <span className="text-[0.65rem] font-bold uppercase tracking-wider text-white/70">
              {typeLabels[booking.type] || booking.type}
            </span>
          </div>
          <p className="mt-2 text-sm font-black text-white">
            {booking.customer.name}
          </p>
          <p className="mt-1 text-xs font-semibold text-white/80">
            {booking.customer.email}
            {booking.customer.phone && ` · ${booking.customer.phone}`}
          </p>
          <p className="mt-1 text-xs font-semibold text-aio-body">{dateLabel}</p>
          {booking.notes && (() => {
            const athleteMatch = booking.notes.match(/^Athletes:\s*(\d+)/m);
            const count = athleteMatch ? parseInt(athleteMatch[1]) : 1;
            return (
              <div className="mt-2">
                {count > 1 && (
                  <span className="mb-1.5 inline-flex items-center gap-1 bg-aio-red px-2 py-0.5 text-[0.58rem] font-black uppercase tracking-wider text-white">
                    {count} Athletes
                  </span>
                )}
                <p className="whitespace-pre-line text-xs font-semibold text-white/80 italic">
                  {booking.notes}
                </p>
              </div>
            );
          })()}
          <p className="mt-2 text-[0.6rem] text-white/60">
            {new Date(booking.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <form action={updateBookingStatus} className="flex items-center gap-2">
            <input type="hidden" name="id" value={booking.id} />
            <select
              name="status"
              defaultValue={booking.status}
              className="border border-aio-line bg-aio-black px-3 py-1.5 text-xs font-bold text-white focus:border-aio-red focus:outline-none"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="bg-aio-red px-3 py-1.5 text-xs font-black uppercase text-white transition hover:bg-aio-red-hover"
            >
              Update
            </button>
          </form>
          <form action={deleteBooking}>
            <input type="hidden" name="id" value={booking.id} />
            <button
              type="submit"
              onClick={(e) => {
                if (!confirm("Delete this booking?")) e.preventDefault();
              }}
              className="border border-aio-line px-3 py-1.5 text-xs font-black uppercase text-aio-muted transition hover:border-red-500 hover:text-red-500"
            >
              Delete
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
