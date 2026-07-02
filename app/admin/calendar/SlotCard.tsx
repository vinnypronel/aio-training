"use client";

import { deleteTimeSlot } from "./actions";

type SlotProps = {
  slot: {
    id: string;
    bookings: { customer: { name: string } }[];
  };
};

export default function SlotCard({ slot }: SlotProps) {
  if (slot.bookings.length > 0) return null;

  return (
    <form action={deleteTimeSlot}>
      <input type="hidden" name="id" value={slot.id} />
      <button
        type="submit"
        onClick={(e) => {
          if (!confirm("Delete this time slot?")) e.preventDefault();
        }}
        className="text-aio-muted transition hover:text-red-500"
        title="Delete slot"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <line x1={18} y1={6} x2={6} y2={18} />
          <line x1={6} y1={6} x2={18} y2={18} />
        </svg>
      </button>
    </form>
  );
}
