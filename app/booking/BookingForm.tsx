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

const sessionTypes = [
  { value: "private", label: "Private Training" },
  { value: "small-group", label: "Small Group" },
  { value: "large-group", label: "Large Group" },
  { value: "event", label: "Event" },
];

const ageGroups = ["8-10", "11-13", "14-16", "17-18"];
const sports = [
  "Baseball",
  "Football",
  "Basketball",
  "Soccer",
  "Personal Training",
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

export default function BookingForm({ slots }: { slots: Slot[] }) {
  const [state, formAction, pending] = useActionState(submitBooking, {
    status: "idle" as const,
    message: "",
  } satisfies BookingFormState);

  const [selectedType, setSelectedType] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

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
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear(calYear - 1);
    } else {
      setCalMonth(calMonth - 1);
    }
  }

  function nextMonth() {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear(calYear + 1);
    } else {
      setCalMonth(calMonth + 1);
    }
  }

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

  const selectedDateFormatted = selectedDate
    ? new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

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
        <div>
          {/* Session Type Buttons */}
          <div>
            <label className={labelClass}>Session Type *</label>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {sessionTypes.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => {
                    setSelectedType(t.value);
                    setSelectedSlot("");
                    setSelectedDate("");
                  }}
                  className={`border py-3 text-xs font-black uppercase tracking-[0.08em] transition ${
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
          <div className="mt-6 border border-aio-line p-5">
            {/* Month nav */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-white">
                {MONTHS[calMonth]} {calYear}
              </h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={prevMonth}
                  className="flex h-9 w-9 items-center justify-center border border-aio-line text-aio-muted transition hover:border-aio-red hover:text-white"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={nextMonth}
                  className="flex h-9 w-9 items-center justify-center border border-aio-line text-aio-muted transition hover:border-aio-red hover:text-white"
                >
                  →
                </button>
              </div>
            </div>

            {/* Day headers */}
            <div className="mt-5 grid grid-cols-7">
              {DAYS.map((d, i) => (
                <div
                  key={`${d}-${i}`}
                  className="py-2 text-center text-xs font-black uppercase tracking-wider text-aio-muted"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7">
              {calendarDays.map((day, i) => {
                if (day === null) {
                  return <div key={`empty-${i}`} className="h-12" />;
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
                    className={`relative flex h-12 items-center justify-center text-sm font-bold transition ${
                      isSelected
                        ? "bg-aio-red text-white"
                        : hasSlots && !isPast
                          ? "bg-aio-red/20 text-white ring-1 ring-aio-red/40 hover:bg-aio-red/35"
                          : isDisabled
                            ? "text-aio-muted/30 cursor-not-allowed"
                            : "text-white/60 hover:bg-white/10 cursor-pointer"
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
              <p className="mt-4 text-center text-xs font-semibold text-aio-muted">
                Select a session type above to see available dates.
              </p>
            )}

            <p className="mt-4 text-center text-[0.6rem] font-black uppercase tracking-[0.15em] text-aio-muted/50">
              Closed Sundays · Sat 9-5 · Mon-Fri 10-8
            </p>
          </div>
        </div>
      </div>

      {/* Your Information — only show after slot is picked */}
      {selectedSlot && (
        <div className="mt-12 border-t border-aio-line pt-10">
          <h3 className="text-sm font-black uppercase tracking-[0.12em] text-aio-red">
            Your Information
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
                placeholder="John Smith"
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
                placeholder="john@example.com"
                className={`mt-2 ${inputClass}`}
              />
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="booking-phone" className={labelClass}>
                Phone
              </label>
              <input
                id="booking-phone"
                name="phone"
                type="tel"
                placeholder="(555) 123-4567"
                className={`mt-2 ${inputClass}`}
              />
            </div>
            <div>
              <label htmlFor="booking-age" className={labelClass}>
                Age Group
              </label>
              <select
                id="booking-age"
                name="ageGroup"
                className={`mt-2 ${inputClass}`}
              >
                <option value="">Select</option>
                {ageGroups.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="booking-sport" className={labelClass}>
                Sport
              </label>
              <select
                id="booking-sport"
                name="sport"
                className={`mt-2 ${inputClass}`}
              >
                <option value="">Select</option>
                {sports.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {state.status === "error" && (
            <div className="mt-4 flex items-center gap-2 border border-red-500/30 px-4 py-2.5">
              <p className="text-xs font-bold text-red-400">{state.message}</p>
            </div>
          )}

          <HoverButton type="submit" disabled={pending || !selectedSlot} className="mt-6 w-full py-3.5 sm:w-auto sm:px-12">
            {pending ? "Submitting…" : "Book Session"}
          </HoverButton>
        </div>
      )}
    </form>
  );
}
