"use client";

import { useActionState, useState, useMemo } from "react";
import { submitBooking, type BookingFormState } from "./actions";
import HoverButton from "@/components/HoverButton";

type Slot = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  type: string;
  title: string;
  spotsLeft: number;
};

type AthleteEntry = {
  name: string;
  ageGroup: string;
  sport: string;
};

const sessionTypes = [
  { value: "private", label: "Private Training" },
  { value: "small-group", label: "Small Group" },
  { value: "large-group", label: "Large Group" },
  { value: "event", label: "Event" },
];

const ageGroups = ["8-12", "13-18"];
const sports = [
  "Baseball Training",
  "Football Training",
  "Basketball Training",
  "Soccer Training",
  "Personal Training",
  "Team Training",
  "Not Sure Yet",
];

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  return days;
}

function formatDate(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function formatTime12(time24: string) {
  const [h, m] = time24.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${h12}:${m} ${ampm}`;
}

function emptyAthlete(): AthleteEntry {
  return { name: "", ageGroup: "", sport: "" };
}

export default function BookingForm({ slots }: { slots: Slot[] }) {
  const [state, formAction, pending] = useActionState(submitBooking, {
    status: "idle" as const,
    message: "",
  } satisfies BookingFormState);

  const [selectedType, setSelectedType] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // Multi-athlete state
  const [athletes, setAthletes] = useState<AthleteEntry[]>([emptyAthlete()]);

  const now = new Date();
  const [calMonth, setCalMonth] = useState(now.getMonth());
  const [calYear, setCalYear] = useState(now.getFullYear());

  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const filteredSlots = selectedType
    ? slots.filter((s) => s.type === selectedType)
    : slots;

  const datesWithSlots = useMemo(() => {
    const set = new Set<string>();
    for (const s of filteredSlots) set.add(s.date);
    return set;
  }, [filteredSlots]);

  const slotsForDate = selectedDate
    ? filteredSlots.filter((s) => s.date === selectedDate)
    : [];

  const calendarDays = getCalendarDays(calYear, calMonth);

  function prevMonth() {
    if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); }
    else setCalMonth(calMonth - 1);
  }

  function nextMonth() {
    if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); }
    else setCalMonth(calMonth + 1);
  }

  // Athlete helpers
  function updateAthlete(idx: number, field: keyof AthleteEntry, value: string) {
    setAthletes((prev) =>
      prev.map((a, i) => (i === idx ? { ...a, [field]: value } : a))
    );
  }

  function addAthlete() {
    setAthletes((prev) => [...prev, emptyAthlete()]);
  }

  function removeAthlete(idx: number) {
    setAthletes((prev) => prev.filter((_, i) => i !== idx));
  }

  const athleteCount = athletes.length;

  // Find selected slot info for summary
  const selectedSlotInfo = slots.find((s) => s.id === selectedSlot);
  const selectedDateFormatted = selectedDate
    ? new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", {
        weekday: "long", month: "long", day: "numeric", year: "numeric",
      })
    : "";

  const inputClass =
    "w-full border border-aio-line bg-transparent px-4 py-2.5 text-sm font-semibold text-white placeholder:text-aio-muted/50 transition focus:border-aio-red focus:outline-none";
  const labelClass =
    "block text-[0.65rem] font-black uppercase tracking-[0.18em] text-aio-muted";

  if (state.status === "success") {
    return (
      <div className="border border-emerald-500/30 p-8 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="mx-auto h-12 w-12 text-emerald-400"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
        <p className="mt-4 text-lg font-black uppercase text-white">
          Booking Submitted!
        </p>
        <p className="mt-2 text-sm font-semibold text-aio-body">
          {state.message}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction}>
      {/* Top row: Hero text left, Calendar right */}
      <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-start">
        {/* Left: Hero info */}
        <div className="pt-4">
          <div className="h-1 w-12 -skew-x-[18deg] bg-aio-red" />
          <p className="mt-3 text-xs font-black uppercase tracking-[0.28em] text-aio-red">
            Reserve Your Spot
          </p>
          <h1 className="mt-4 font-brand-display text-[clamp(2.75rem,7vw,5rem)] font-black uppercase leading-[0.9]">
            Book A<br />
            <span className="text-aio-red">Session</span>
          </h1>
          <p className="mt-5 max-w-[480px] text-base font-semibold leading-8 text-aio-body md:text-lg">
            Pick your training type, choose an available time slot, and we&apos;ll confirm your spot.
          </p>

          {/* Time Slots for Selected Date */}
          {selectedDate && (
            <div className="mt-10">
              <h2 className="text-lg font-black text-white">
                {selectedDateFormatted}
              </h2>
              {slotsForDate.length === 0 ? (
                <p className="mt-4 text-sm font-semibold text-aio-muted">
                  No available slots on this date.
                </p>
              ) : (
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {slotsForDate.map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setSelectedSlot(slot.id)}
                      className={`border p-4 text-left transition ${
                        selectedSlot === slot.id
                          ? "border-aio-red bg-aio-red/10"
                          : "border-aio-line hover:border-aio-red"
                      }`}
                    >
                      <p className="text-sm font-bold text-white">
                        {formatTime12(slot.startTime)} – {formatTime12(slot.endTime)}
                      </p>
                      {slot.title && (
                        <p className="mt-0.5 text-xs text-aio-muted">{slot.title}</p>
                      )}
                      <p className="mt-1.5 text-[0.65rem] font-bold text-emerald-400">
                        {slot.spotsLeft} spot{slot.spotsLeft !== 1 && "s"} left
                      </p>
                    </button>
                  ))}
                </div>
              )}
              <input type="hidden" name="slotId" value={selectedSlot} />
            </div>
          )}
        </div>

        {/* Right: Session types + Calendar */}
        <div className="lg:max-w-[480px] lg:justify-self-end w-full">
          {/* Session Type Buttons */}
          <div>
            <label className={labelClass}>Session Type *</label>
            <div className="mt-2 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {sessionTypes.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => {
                    setSelectedType(t.value);
                    setSelectedSlot("");
                    setSelectedDate("");
                  }}
                  className={`border py-2 sm:py-2.5 text-xs font-black uppercase tracking-[0.08em] transition ${
                    selectedType === t.value
                      ? "border-aio-red bg-aio-red text-white"
                      : "border-aio-line text-aio-muted hover:border-aio-red hover:text-white"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <input type="hidden" name="type" value={selectedType} />
          </div>

          {/* Calendar */}
          <div className="mt-4 border border-aio-line bg-aio-panel/80 p-4 sm:p-5 shadow-[var(--aio-shadow-hard)] backdrop-blur-sm">
            {/* Month nav */}
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-black text-white">
                {MONTHS[calMonth]} {calYear}
              </h2>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={prevMonth}
                  className="flex h-9 sm:h-10 w-9 sm:w-10 items-center justify-center border border-aio-line text-aio-muted transition hover:border-aio-red hover:text-white"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={nextMonth}
                  className="flex h-9 sm:h-10 w-9 sm:w-10 items-center justify-center border border-aio-line text-aio-muted transition hover:border-aio-red hover:text-white"
                >
                  →
                </button>
              </div>
            </div>

            {/* Day headers */}
            <div className="mt-4 grid grid-cols-7">
              {DAYS.map((d, i) => (
                <div
                  key={`${d}-${i}`}
                  className="py-1 sm:py-1.5 text-center text-xs font-black uppercase tracking-wider text-aio-muted"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7">
              {calendarDays.map((day, i) => {
                if (day === null) {
                  return <div key={`empty-${i}`} className="h-10 sm:h-11" />;
                }

                const dateStr = formatDate(calYear, calMonth, day);
                const hasSlots = selectedType && datesWithSlots.has(dateStr);
                const isPast = dateStr < todayStr;
                const isSelected = dateStr === selectedDate;
                const isToday = dateStr === todayStr;
                const isSunday = new Date(calYear, calMonth, day).getDay() === 0;
                const isDisabled = isPast || isSunday;

                return (
                  <button
                    key={dateStr}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => {
                      setSelectedDate(dateStr);
                      setSelectedSlot("");
                    }}
                    className={`relative flex h-10 sm:h-11 items-center justify-center text-xs sm:text-sm font-bold transition ${
                      isSelected
                        ? "bg-aio-red text-white"
                        : hasSlots && !isPast
                          ? "bg-aio-red/20 text-white ring-1 ring-aio-red/40 hover:bg-aio-red/35"
                          : isDisabled
                            ? "cursor-not-allowed text-aio-muted/30"
                            : "cursor-pointer text-white/60 hover:bg-white/10"
                    } ${isToday && !isSelected ? "ring-1 ring-aio-red" : ""}`}
                  >
                    {day}
                    {hasSlots && !isPast && !isSelected && (
                      <span className="absolute bottom-1.5 h-1 w-1 rounded-full bg-aio-red" />
                    )}
                  </button>
                );
              })}
            </div>

            {!selectedType && (
              <p className="mt-3 text-center text-xs font-semibold text-aio-muted">
                Select a session type above to see available dates.
              </p>
            )}

            <p className="mt-3 text-center text-[0.6rem] font-black uppercase tracking-[0.15em] text-aio-muted/50">
              Closed Sundays · Sat 9-5 · Mon-Fri 10-8
            </p>
          </div>
        </div>
      </div>

      {/* Your Information + Athletes — only show after slot is picked */}
      {selectedSlot && (
        <div className="mt-12 border-t border-aio-line pt-10">

          {/* ── Parent / Guardian ─────────────────────────── */}
          <h3 className="text-sm font-black uppercase tracking-[0.12em] text-aio-red">
            Parent / Guardian Info
          </h3>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="booking-name" className={labelClass}>
                Full Name *
              </label>
              <input
                id="booking-name"
                name="name"
                required
                placeholder="Jane Smith"
                className={`mt-2 ${inputClass}`}
              />
            </div>
            <div>
              <label htmlFor="booking-email" className={labelClass}>
                Email *
              </label>
              <input
                id="booking-email"
                name="email"
                type="email"
                required
                placeholder="jane@example.com"
                className={`mt-2 ${inputClass}`}
              />
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="booking-phone" className={labelClass}>
              Phone
            </label>
            <input
              id="booking-phone"
              name="phone"
              type="tel"
              placeholder="(555) 123-4567"
              className={`mt-2 ${inputClass} sm:max-w-[320px]`}
            />
          </div>

          {/* ── Athletes ──────────────────────────────────── */}
          <div className="mt-10">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-[0.12em] text-aio-red">
                Athletes{" "}
                <span className="ml-2 inline-flex h-5 w-5 items-center justify-center bg-aio-red text-[0.6rem] font-black text-white">
                  {athleteCount}
                </span>
              </h3>
            </div>

            <div className="mt-6 space-y-4">
              {athletes.map((athlete, idx) => (
                <div
                  key={idx}
                  className="border border-aio-line p-5 transition hover:border-aio-red/40"
                >
                  {/* Card header */}
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-[0.65rem] font-black uppercase tracking-[0.18em] text-aio-muted">
                      Athlete {idx + 1}
                    </span>
                    {athletes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAthlete(idx)}
                        className="-my-2 flex min-h-11 items-center gap-1 px-2 text-[0.6rem] font-black uppercase tracking-[0.14em] text-aio-muted/60 transition hover:text-aio-red"
                        aria-label={`Remove athlete ${idx + 1}`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2.5}
                          className="h-3 w-3"
                        >
                          <line x1={18} y1={6} x2={6} y2={18} />
                          <line x1={6} y1={6} x2={18} y2={18} />
                        </svg>
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    {/* Athlete name */}
                    <div>
                      <label
                        htmlFor={`athlete-name-${idx}`}
                        className={labelClass}
                      >
                        Athlete Name
                      </label>
                      <input
                        id={`athlete-name-${idx}`}
                        type="text"
                        placeholder="Athlete's name"
                        value={athlete.name}
                        onChange={(e) => updateAthlete(idx, "name", e.target.value)}
                        className={`mt-2 ${inputClass}`}
                      />
                    </div>
                    {/* Age group */}
                    <div>
                      <label
                        htmlFor={`athlete-age-${idx}`}
                        className={labelClass}
                      >
                        Age Group
                      </label>
                      <select
                        id={`athlete-age-${idx}`}
                        value={athlete.ageGroup}
                        onChange={(e) => updateAthlete(idx, "ageGroup", e.target.value)}
                        className={`mt-2 ${inputClass}`}
                      >
                        <option value="" className="text-black bg-white">Select</option>
                        {ageGroups.map((a) => (
                          <option key={a} value={a} className="text-black bg-white">
                            {a}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* Sport */}
                    <div>
                      <label
                        htmlFor={`athlete-sport-${idx}`}
                        className={labelClass}
                      >
                        Sport
                      </label>
                      <select
                        id={`athlete-sport-${idx}`}
                        value={athlete.sport}
                        onChange={(e) => updateAthlete(idx, "sport", e.target.value)}
                        className={`mt-2 ${inputClass}`}
                      >
                        <option value="" className="text-black bg-white">Select</option>
                        {sports.map((s) => (
                          <option key={s} value={s} className="text-black bg-white">
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Athlete button */}
            <button
              type="button"
              onClick={addAthlete}
              className="mt-4 flex items-center gap-2 border border-dashed border-aio-line px-5 py-3 text-[0.65rem] font-black uppercase tracking-[0.18em] text-aio-muted transition hover:border-aio-red hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                className="h-3.5 w-3.5"
              >
                <line x1={12} y1={5} x2={12} y2={19} />
                <line x1={5} y1={12} x2={19} y2={12} />
              </svg>
              Add Another Athlete
            </button>
          </div>

          {/* Hidden field — serialized athlete data */}
          <input
            type="hidden"
            name="athletes"
            value={JSON.stringify(athletes)}
          />

          {/* ── Order Summary ─────────────────────────────── */}
          <div className="mt-10 border border-aio-line bg-aio-panel/40 p-5">
            <p className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-aio-muted">
              Order Summary
            </p>
            <div className="mt-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-aio-body">Session Type</span>
                <span className="text-sm font-black uppercase text-white">
                  {sessionTypes.find((t) => t.value === selectedType)?.label ?? "—"}
                </span>
              </div>
              {selectedSlotInfo && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-aio-body">Time</span>
                  <span className="text-sm font-black text-white">
                    {selectedDateFormatted
                      ? new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      : ""}{" "}
                    · {formatTime12(selectedSlotInfo.startTime)} –{" "}
                    {formatTime12(selectedSlotInfo.endTime)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between border-t border-aio-line pt-2.5">
                <span className="text-sm font-semibold text-aio-body">Athletes</span>
                <span className="flex items-center gap-2 text-sm font-black text-white">
                  <span className="flex h-5 w-5 items-center justify-center bg-aio-red text-[0.6rem] font-black text-white">
                    {athleteCount}
                  </span>
                  {athleteCount === 1 ? "1 Athlete" : `${athleteCount} Athletes`}
                </span>
              </div>
            </div>
            <p className="mt-4 text-[0.6rem] font-semibold leading-relaxed text-aio-muted/70">
              AIO will contact you to confirm your spot and collect payment. Pricing varies by session type and athlete count.
            </p>
          </div>

          {/* Error */}
          {state.status === "error" && (
            <div className="mt-4 flex items-center gap-2 border border-red-500/30 px-4 py-2.5">
              <p className="text-xs font-bold text-red-400">{state.message}</p>
            </div>
          )}

          <HoverButton
            type="submit"
            disabled={pending || !selectedSlot}
            className="mt-6 w-full py-3.5 sm:w-auto sm:px-12"
          >
            {pending
              ? "Submitting…"
              : athleteCount === 1
                ? "Book Session"
                : `Book for ${athleteCount} Athletes`}
          </HoverButton>
        </div>
      )}
    </form>
  );
}
