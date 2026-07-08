"use client";

import { useState, useMemo } from "react";
import AddSlotForm from "./AddSlotForm";
import SlotCard from "./SlotCard";

type SlotData = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  type: string;
  title: string;
  maxCapacity: number;
  bookedCount: number;
  bookings: { customer: { name: string } }[];
};

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

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function formatDateStr(year: number, month: number, day: number) {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

function formatTime12(time24: string) {
  const [h, m] = time24.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${h12}:${m} ${ampm}`;
}

export default function CalendarView({ slots }: { slots: SlotData[] }) {
  const now = new Date();
  const [calMonth, setCalMonth] = useState(now.getMonth());
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [selectedDate, setSelectedDate] = useState(
    formatDateStr(now.getFullYear(), now.getMonth(), now.getDate()),
  );

  const todayStr = formatDateStr(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );

  const datesWithSlots = useMemo(() => {
    const set = new Set<string>();
    for (const s of slots) set.add(s.date);
    return set;
  }, [slots]);

  const slotsForDate = useMemo(
    () => slots.filter((s) => s.date === selectedDate),
    [slots, selectedDate],
  );

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

  const selectedDateFormatted = selectedDate
    ? new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <>
      <div className="mt-10 grid gap-8 lg:grid-cols-[400px_1fr]">
        {/* Left: Monthly Calendar */}
        <div className="border border-aio-line p-6">
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
          <div className="mt-6 grid grid-cols-7">
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

              const dateStr = formatDateStr(calYear, calMonth, day);
              const hasSlots = datesWithSlots.has(dateStr);
              const isSelected = dateStr === selectedDate;
              const isToday = dateStr === todayStr;
              const isPast = dateStr < todayStr;

              return (
                <button
                  key={dateStr}
                  type="button"
                  disabled={isPast}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`relative flex h-12 items-center justify-center text-sm font-bold transition ${
                    isPast
                      ? "text-white/20 cursor-not-allowed"
                      : isSelected
                        ? "bg-aio-red text-white"
                        : isToday
                          ? "bg-aio-red/20 text-white"
                          : "text-white/80 hover:bg-white/5"
                  }`}
                >
                  {day}
                  {hasSlots && !isSelected && (
                    <span className="absolute bottom-1.5 h-1 w-1 rounded-full bg-aio-red" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Time Slots for Selected Date */}
        <div>
          <h2 className="text-xl font-black text-white">
            {selectedDateFormatted}
          </h2>

          {slotsForDate.length === 0 ? (
            <div className="mt-6 border border-aio-line p-8 text-center">
              <p className="text-sm font-semibold text-aio-muted">
                No time slots for this date.
              </p>
              <p className="mt-1 text-xs text-aio-muted/60">
                Use the form below to add slots.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {slotsForDate.map((slot) => (
                <div
                  key={slot.id}
                  className="border border-aio-line p-4 transition hover:border-aio-red"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-white">
                      {formatTime12(slot.startTime)}
                    </span>
                    <SlotCard slot={slot} />
                  </div>
                  <p className="mt-1 text-xs text-aio-muted">
                    to {formatTime12(slot.endTime)}
                  </p>
                  {slot.title && (
                    <p className="mt-2 text-sm font-semibold text-white/80">
                      {slot.title}
                    </p>
                  )}
                  <div className="mt-3 flex items-center justify-between">
                    <TypeBadge type={slot.type} />
                    <span className="text-xs font-bold text-aio-muted">
                      {slot.bookedCount}/{slot.maxCapacity} booked
                      {slot.maxCapacity - slot.bookedCount > 0 ? (
                        <span className="text-emerald-400">
                          {" "}
                          · {slot.maxCapacity - slot.bookedCount} left
                        </span>
                      ) : (
                        <span className="text-red-400"> · Full</span>
                      )}
                    </span>
                  </div>
                  {slot.bookings.length > 0 && (
                    <div className="mt-3 border-t border-aio-line pt-3">
                      <p className="text-[0.6rem] font-black uppercase tracking-wider text-aio-muted">
                        Booked
                      </p>
                      {slot.bookings.map((b, i) => (
                        <p
                          key={i}
                          className="mt-1 text-xs font-semibold text-white/70"
                        >
                          {b.customer.name}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AddSlotForm defaultDate={selectedDate} />
    </>
  );
}

function TypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    private: "bg-blue-600",
    "small-group": "bg-emerald-600",
    "large-group": "bg-amber-600",
    event: "bg-aio-red",
  };
  const labels: Record<string, string> = {
    private: "Private",
    "small-group": "Small Group",
    "large-group": "Large Group",
    event: "Event",
  };

  return (
    <span
      className={`inline-block px-2 py-0.5 text-[0.6rem] font-black uppercase tracking-wider text-white ${colors[type] || "bg-aio-muted"}`}
    >
      {labels[type] || type}
    </span>
  );
}
