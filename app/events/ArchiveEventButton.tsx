"use client";

import { toggleArchiveEvent } from "./actions";

export default function ArchiveEventButton({
  eventId,
  isArchived,
}: {
  eventId: string;
  isArchived: boolean;
}) {
  return (
    <form action={toggleArchiveEvent}>
      <input type="hidden" name="id" value={eventId} />
      <button
        type="submit"
        className={`absolute top-3 right-12 z-10 flex h-8 px-2.5 items-center gap-1.5 text-[10px] font-black uppercase tracking-wider transition ${
          isArchived
            ? "bg-emerald-800/90 text-white hover:bg-emerald-700"
            : "bg-black/70 text-white/80 hover:bg-neutral-800 hover:text-white"
        }`}
        title={isArchived ? "Restore to Upcoming Events" : "Move to Past Events"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-3.5 w-3.5"
        >
          {isArchived ? (
            <path d="M3 10h10a5 5 0 0 1 5 5v2m0 0l-3-3m3 3l3-3M3 10l3-3m-3 3l3 3" />
          ) : (
            <>
              <rect width="20" height="5" x="2" y="3" rx="1" />
              <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
              <path d="M10 12h4" />
            </>
          )}
        </svg>
        <span>{isArchived ? "Restore" : "Archive"}</span>
      </button>
    </form>
  );
}
