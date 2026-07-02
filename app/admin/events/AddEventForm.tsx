"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { createEvent } from "./actions";

export default function AddEventForm() {
  const [state, formAction, pending] = useActionState(createEvent, null);
  const [sessions, setSessions] = useState([{ label: "", time: "" }]);
  const [preview, setPreview] = useState<string | null>(null);

  function addSession() {
    setSessions((prev) => [...prev, { label: "", time: "" }]);
  }

  function removeSession(index: number) {
    setSessions((prev) => prev.filter((_, i) => i !== index));
  }

  function updateSession(index: number, field: "label" | "time", value: string) {
    setSessions((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  }

  const inputClass =
    "w-full border border-aio-line bg-aio-black/60 px-4 py-2.5 text-sm font-semibold text-white placeholder:text-aio-muted/50 transition focus:border-aio-red focus:outline-none";
  const labelClass =
    "block text-[0.65rem] font-black uppercase tracking-[0.18em] text-aio-muted";

  return (
    <form action={formAction} className="mt-4 space-y-5 border border-aio-line bg-aio-panel p-6">
      {/* Flyer Upload */}
      <div>
        <label className={labelClass}>Flyer Image</label>
        <div className="mt-2 flex items-start gap-4">
          {preview && (
            <div className="relative h-32 w-24 shrink-0 overflow-hidden border border-aio-line bg-aio-black">
              <Image
                src={preview}
                alt="Flyer preview"
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
          )}
          <input
            type="file"
            name="flyer"
            accept="image/*"
            onChange={handleFileChange}
            className="text-sm text-aio-muted file:mr-3 file:border file:border-aio-line file:bg-aio-black file:px-4 file:py-2 file:text-xs file:font-bold file:uppercase file:text-white file:transition hover:file:border-aio-red"
          />
        </div>
      </div>

      {/* Title & Badge */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="title" className={labelClass}>
            Event Title
          </label>
          <input
            id="title"
            name="title"
            required
            placeholder="AIO Football Skills Clinic"
            className={`mt-2 ${inputClass}`}
          />
        </div>
        <div>
          <label htmlFor="badge" className={labelClass}>
            Badge Label
          </label>
          <input
            id="badge"
            name="badge"
            required
            placeholder="2-Day Summer Clinic"
            className={`mt-2 ${inputClass}`}
          />
        </div>
      </div>

      {/* Tag & Price */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="tag" className={labelClass}>
            Tag
          </label>
          <input
            id="tag"
            name="tag"
            required
            placeholder="Open — Limited Spots"
            className={`mt-2 ${inputClass}`}
          />
        </div>
        <div>
          <label htmlFor="price" className={labelClass}>
            Price Text
          </label>
          <input
            id="price"
            name="price"
            required
            placeholder="$125 early, then $150"
            className={`mt-2 ${inputClass}`}
          />
        </div>
      </div>

      {/* Date & Location */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="date" className={labelClass}>
            Date
          </label>
          <input
            id="date"
            name="date"
            required
            placeholder="July 25-26, 2026"
            className={`mt-2 ${inputClass}`}
          />
        </div>
        <div>
          <label htmlFor="location" className={labelClass}>
            Location
          </label>
          <input
            id="location"
            name="location"
            required
            placeholder="Heavenly Farms Park"
            className={`mt-2 ${inputClass}`}
          />
        </div>
      </div>

      {/* Sessions */}
      <div>
        <div className="flex items-center justify-between">
          <label className={labelClass}>Sessions</label>
          <button
            type="button"
            onClick={addSession}
            className="text-xs font-bold uppercase tracking-wider text-aio-red transition hover:text-aio-red-hover"
          >
            + Add Session
          </button>
        </div>
        <div className="mt-2 space-y-3">
          {sessions.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                name="sessionLabel"
                value={s.label}
                onChange={(e) => updateSession(i, "label", e.target.value)}
                placeholder="Ages 8-12"
                className={`flex-1 ${inputClass}`}
              />
              <input
                name="sessionTime"
                value={s.time}
                onChange={(e) => updateSession(i, "time", e.target.value)}
                placeholder="6:00 PM - 8:00 PM"
                className={`flex-1 ${inputClass}`}
              />
              {sessions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSession(i)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center text-aio-muted transition hover:text-red-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="h-4 w-4"
                  >
                    <line x1={18} y1={6} x2={6} y2={18} />
                    <line x1={6} y1={6} x2={18} y2={18} />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {state?.error && (
        <div className="flex items-center gap-2 border border-red-500/30 bg-red-500/10 px-4 py-2.5">
          <p className="text-xs font-bold text-red-400">{state.error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-aio-red py-3 text-sm font-black uppercase tracking-[0.1em] text-white transition hover:bg-aio-red-hover disabled:opacity-50 sm:w-auto sm:px-8"
      >
        {pending ? "Adding Event…" : "Add Event"}
      </button>
    </form>
  );
}
