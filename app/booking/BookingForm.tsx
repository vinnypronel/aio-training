"use client";

import { useActionState, useState, useMemo, useRef, useEffect } from "react";
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
  { value: "Speed and Agility Training", label: "Speed and Agility Training" },
  { value: "Personal Training", label: "Personal Training" },
  { value: "Team Training", label: "Team Training" },
  { value: "Baseball Training", label: "Baseball Training" },
  { value: "Football Training", label: "Football Training" },
  { value: "Soccer Training", label: "Soccer Training" },
  { value: "Basketball Training", label: "Basketball Training" },
];

const ageGroups = ["8-12", "13-18"];
const sports = [
  "Speed and Agility Training",
  "Personal Training",
  "Team Training",
  "Baseball Training",
  "Football Training",
  "Soccer Training",
  "Basketball Training",
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
  if (!time24 || !time24.includes(":")) return time24 || "";
  const [h, m] = time24.split(":");
  const hour = parseInt(h);
  if (isNaN(hour)) return time24;
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${h12}:${m} ${ampm}`;
}

function emptyAthlete(): AthleteEntry {
  return { name: "", ageGroup: "", sport: "" };
}

export default function BookingForm({ slots: _slots }: { slots: Slot[] }) {
  void _slots;

  const [state, formAction, pending] = useActionState(submitBooking, {
    status: "idle" as const,
    message: "",
  } satisfies BookingFormState);

  const [selectedType, setSelectedType] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [customTime, setCustomTime] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [openAgeDropdownIdx, setOpenAgeDropdownIdx] = useState<number | null>(null);
  const [openSportDropdownIdx, setOpenSportDropdownIdx] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const parentInfoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedSlot) {
      const timer = setTimeout(() => {
        const element = parentInfoRef.current;
        if (element) {
          const yOffset = -100; // Offset for sticky header
          const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [selectedSlot]);

  // Multi-athlete state
  const [athletes, setAthletes] = useState<AthleteEntry[]>([emptyAthlete()]);

  const now = new Date();
  const [calMonth, setCalMonth] = useState(now.getMonth());
  const [calYear, setCalYear] = useState(now.getFullYear());

  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const slotsForDate = useMemo(() => {
    if (!selectedDate) return [];
    
    return [
      { startTime: "09:00", endTime: "10:30" },
      { startTime: "10:30", endTime: "12:00" },
      { startTime: "12:00", endTime: "13:30" },
      { startTime: "13:30", endTime: "15:00" },
      { startTime: "15:00", endTime: "16:30" },
      { startTime: "16:30", endTime: "18:00" },
      { startTime: "18:00", endTime: "19:30" },
    ];
  }, [selectedDate]);

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
    // Clear errors
    const errKey =
      field === "name"
        ? `athleteName_${idx}`
        : field === "ageGroup"
        ? `athleteAge_${idx}`
        : `athleteSport_${idx}`;
    if (errors[errKey]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[errKey];
        return next;
      });
    }
  }

  function addAthlete() {
    setAthletes((prev) => [...prev, emptyAthlete()]);
  }

  function removeAthlete(idx: number) {
    setAthletes((prev) => prev.filter((_, i) => i !== idx));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[`athleteName_${idx}`];
      delete next[`athleteAge_${idx}`];
      delete next[`athleteSport_${idx}`];
      return next;
    });
  }

  const athleteCount = athletes.length;

  const handleSubmit = (formData: FormData) => {
    const newErrors: Record<string, string> = {};
    if (!selectedType) newErrors.type = "Please select a training program";
    if (!selectedDate) newErrors.date = "Please select a date";
    if (!selectedSlot) newErrors.slot = "Please select a time slot";

    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }

    const parentName = formData.get("name") as string;
    const parentEmail = formData.get("email") as string;

    if (!parentName?.trim()) {
      newErrors.name = "Please fill out this field.";
    }
    if (!parentEmail?.trim()) {
      newErrors.email = "Please fill out this field.";
    } else if (!parentEmail.includes("@")) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (selectedSlot === "custom") {
      const timeVal = formData.get("customTime") as string;
      if (!timeVal?.trim()) {
        newErrors.customTime = "Please fill out this field.";
      }
    }
    
    athletes.forEach((athlete, idx) => {
      if (!athlete.name.trim()) newErrors[`athleteName_${idx}`] = "Please fill out this field.";
      if (!athlete.ageGroup) newErrors[`athleteAge_${idx}`] = "Please select an option.";
      if (!athlete.sport) newErrors[`athleteSport_${idx}`] = "Please select an option.";
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Focus first error
      const firstError = Object.keys(newErrors)[0];
      if (firstError === "name") {
        document.getElementById("booking-name")?.focus();
      } else if (firstError === "email") {
        document.getElementById("booking-email")?.focus();
      } else if (firstError === "customTime") {
        document.getElementById("booking-custom-time")?.focus();
      } else if (firstError.startsWith("athleteName_")) {
        const idx = firstError.split("_")[1];
        document.getElementById(`athlete-name-${idx}`)?.focus();
      } else if (firstError.startsWith("athleteAge_")) {
        const idx = firstError.split("_")[1];
        document.getElementById(`athlete-age-select-trigger-${idx}`)?.focus();
      } else if (firstError.startsWith("athleteSport_")) {
        const idx = firstError.split("_")[1];
        document.getElementById(`athlete-sport-select-trigger-${idx}`)?.focus();
      }

      // Automatically hide validation alerts after 4 seconds
      validationTimeoutRef.current = setTimeout(() => {
        setErrors({});
      }, 4000);
      return;
    }

    // Set dynamic start/end times
    if (selectedSlot === "custom") {
      const timeVal = formData.get("customTime") as string;
      const parts = timeVal.split(/[-–]| to /);
      if (parts.length >= 2) {
        formData.set("startTime", parts[0].trim());
        formData.set("endTime", parts[1].trim());
      } else {
        formData.set("startTime", "Custom Time");
        formData.set("endTime", timeVal.trim());
      }
    } else {
      formData.set("startTime", selectedSlotInfo?.startTime || "");
      formData.set("endTime", selectedSlotInfo?.endTime || "");
    }

    formAction(formData);
  };

  // Find selected slot info for summary
  const selectedSlotInfo = selectedSlot
    ? selectedSlot === "custom"
      ? { startTime: "Custom Time", endTime: customTime || "Request" }
      : (() => {
          const [start, end] = selectedSlot.split("-");
          return { startTime: start, endTime: end };
        })()
    : null;
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
      <div className="mx-auto flex min-h-[calc(70svh/var(--dz,1))] max-w-[640px] flex-col items-center justify-center py-14 text-center sm:py-20">
        <div className="h-1 w-12 -skew-x-[18deg] bg-aio-red" />
        <p className="mt-5 text-xs font-black uppercase tracking-[0.28em] text-aio-red">
          Reservation Received
        </p>

        {/* Check mark */}
        <div className="mt-8 flex h-20 w-20 items-center justify-center border-2 border-aio-red">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            className="h-10 w-10 text-aio-red"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" />
          </svg>
        </div>

        <h1 className="mt-7 font-brand-display text-[clamp(2.5rem,7vw,4.75rem)] font-black uppercase leading-[0.9]">
          Booking<br />
          <span className="text-aio-red">Submitted</span>
        </h1>

        <p className="mt-5 max-w-[480px] text-base font-semibold leading-8 text-aio-body">
          {state.message}
        </p>

        {/* What happens next */}
        <div className="mt-9 w-full max-w-[440px] border-y border-aio-line py-6 text-left">
          <p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-aio-red-on-dark">
            What Happens Next
          </p>
          <ul className="mt-4 space-y-2.5">
            {[
              "We review your requested training time.",
              "AIO reaches out by call or text to confirm.",
              "Payment is handled once your spot is locked in.",
            ].map((step) => (
              <li key={step} className="flex gap-3 text-sm font-semibold text-aio-body">
                <span aria-hidden className="mt-2 h-px w-4 shrink-0 bg-aio-red" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-center">
          <HoverButton href="/" className="w-full sm:w-auto">
            Back to Home
          </HoverButton>
          <HoverButton href="/booking" variant="outline" className="w-full sm:w-auto">
            Book Another Session
          </HoverButton>
        </div>

        <p className="mt-7 text-xs font-semibold text-aio-muted">
          Need to reach us now?{" "}
          <a
            href="tel:+17144408053"
            className="font-black text-white underline decoration-aio-red decoration-2 underline-offset-4 transition hover:text-aio-red"
          >
            (714) 440-8053
          </a>
        </p>
      </div>
    );
  }

  return (
    <form action={handleSubmit} noValidate>
      {/* Top row: Hero text left, Calendar right */}
      <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-start">
        {/* Left: Hero info */}
        <div className="pt-2 lg:-translate-x-[50px]">
          <div className="mt-3 flex items-center gap-2.5 text-xs font-black uppercase tracking-[0.28em] text-aio-red">
            <svg className="h-3.5 w-2 text-white shrink-0" fill="none" viewBox="0 0 10 20" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 2H2v16h6" />
            </svg>
            <span>Reserve Your Spot</span>
            <svg className="h-3.5 w-2 text-white shrink-0" fill="none" viewBox="0 0 10 20" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2 2h6v16H2" />
            </svg>
          </div>
          <h1 className="mt-4 font-brand-display text-[clamp(2.75rem,7vw,5.5rem)] font-black uppercase leading-[0.9]">
            Book A<br />
            <span className="text-aio-red">Session</span>
          </h1>
          <p className="mt-5 max-w-[520px] text-base font-semibold leading-8 text-aio-body md:text-lg">
            Pick your training type, choose an available time slot, and we&apos;ll reach out to confirm your spot.
          </p>

          {/* Program Selection Dropdown */}
          <div className="mt-8 max-w-[420px] relative">
            <label className="block text-[0.65rem] font-black uppercase tracking-[0.18em] text-aio-muted">
              Choose Your Training Path *
            </label>
            
            {/* Hidden Input for Form Submission */}
            <input type="hidden" name="type" value={selectedType} />

            {/* Custom Dropdown Trigger */}
            <button
              id="booking-type-select-trigger"
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="mt-2 flex w-full items-center justify-between border border-aio-line bg-aio-black/60 px-4 py-3 text-sm font-black uppercase tracking-[0.08em] text-white transition hover:border-aio-red focus:outline-none"
            >
              <span>
                {selectedType ? sessionTypes.find(t => t.value === selectedType)?.label : "Select a Program"}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                className={`h-4 w-4 text-white/70 transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              >
                <path d="M6 15l6-6 6 6" />
              </svg>
            </button>

            {/* Backdrop click listener to close dropdown */}
            {isDropdownOpen && (
              <div
                className="fixed inset-0 z-20"
                onClick={() => setIsDropdownOpen(false)}
              />
            )}

            {/* Custom Dropdown Menu */}
            <div
              className={`absolute top-full left-0 z-30 mt-0 w-full bg-aio-black border border-aio-line p-2 shadow-[0_18px_40px_rgba(0,0,0,0.65)] transition duration-200 origin-top ${
                isDropdownOpen
                  ? "visible opacity-100 scale-y-100"
                  : "invisible opacity-0 scale-y-95 pointer-events-none"
              }`}
            >
              <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                {sessionTypes.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => {
                      setSelectedType(t.value);
                      setIsDropdownOpen(false);
                      setSelectedSlot("");
                      setSelectedDate("");
                    }}
                    className={`block w-full text-left px-4 py-3 text-xs font-black uppercase tracking-[0.1em] transition-colors hover:bg-aio-panel ${
                      selectedType === t.value
                        ? "text-aio-red bg-aio-panel/40"
                        : "text-white/85 hover:text-aio-red"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Time Slots for Selected Date */}
          {selectedDate && (
            <div className="mt-10">
              <h2 className="text-lg font-black text-white">
                {selectedDateFormatted}
              </h2>
              {slotsForDate.length === 0 ? (
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setSelectedSlot("custom")}
                    className={`border py-2 px-3 text-left transition flex items-center justify-between gap-4 ${
                      selectedSlot === "custom"
                        ? "border-aio-red bg-aio-red/10"
                        : "border-aio-line hover:border-aio-red"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-bold text-white">
                        Request Custom Time
                      </p>
                      <p className="mt-0.5 text-[0.65rem] font-bold text-aio-muted">
                        Type your preferred time below
                      </p>
                    </div>
                    <svg className="h-5.5 w-5.5 text-white shrink-0 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <defs>
                        <mask id="pencil-mask-1">
                          <rect x="0" y="0" width="24" height="24" fill="white" />
                          <path d="M17.5 6.5l3 3L11.5 18.5H8.5v-3L17.5 6.5Z" fill="black" stroke="black" strokeWidth={3.5} />
                        </mask>
                      </defs>
                      <g mask="url(#pencil-mask-1)">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 5V3.5h4V5a6.5 6.5 0 0 0 1.62.67l1.06-1.06 2.83 2.83-1.06 1.06A6.5 6.5 0 0 0 19 10h1.5v4H19a6.5 6.5 0 0 0-.67 1.62l1.06 1.06-2.83 2.83-1.06-1.06A6.5 6.5 0 0 0 14 19v1.5h-4V19a6.5 6.5 0 0 0-1.62-.67l-1.06 1.06-2.83-2.83 1.06-1.06A6.5 6.5 0 0 0 5 14H3.5v-4H5a6.5 6.5 0 0 0 .67-1.62L4.61 5.32l2.83-2.83 1.06 1.06A6.5 6.5 0 0 0 10 5Z" />
                      </g>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.5 6.5l3 3L11.5 18.5H8.5v-3L17.5 6.5Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 8l3 3M10 16l3 3" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {slotsForDate.map((slot) => {
                    const slotValue = `${slot.startTime}-${slot.endTime}`;
                    const isSelected = selectedSlot === slotValue;
                    return (
                      <button
                        key={slotValue}
                        type="button"
                        onClick={() => setSelectedSlot(slotValue)}
                        className={`border py-2 px-3 text-left transition ${
                          isSelected
                            ? "border-aio-red bg-aio-red/10"
                            : "border-aio-line hover:border-aio-red"
                        }`}
                      >
                        <p className="text-sm font-bold text-white">
                          {formatTime12(slot.startTime)} – {formatTime12(slot.endTime)}
                        </p>
                        <p className="mt-0.5 text-[0.65rem] font-bold text-aio-muted">
                          Request Slot
                        </p>
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => setSelectedSlot("custom")}
                    className={`border py-2 px-3 text-left transition flex items-center justify-between gap-4 ${
                      selectedSlot === "custom"
                        ? "border-aio-red bg-aio-red/10"
                        : "border-aio-line hover:border-aio-red"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-bold text-white">
                        Request Custom Time
                      </p>
                      <p className="mt-0.5 text-[0.65rem] font-bold text-aio-muted">
                        Type your preferred time below
                      </p>
                    </div>
                    <svg className="h-5.5 w-5.5 text-white shrink-0 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <defs>
                        <mask id="pencil-mask-2">
                          <rect x="0" y="0" width="24" height="24" fill="white" />
                          <path d="M17.5 6.5l3 3L11.5 18.5H8.5v-3L17.5 6.5Z" fill="black" stroke="black" strokeWidth={3.5} />
                        </mask>
                      </defs>
                      <g mask="url(#pencil-mask-2)">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 5V3.5h4V5a6.5 6.5 0 0 0 1.62.67l1.06-1.06 2.83 2.83-1.06 1.06A6.5 6.5 0 0 0 19 10h1.5v4H19a6.5 6.5 0 0 0-.67 1.62l1.06 1.06-2.83 2.83-1.06-1.06A6.5 6.5 0 0 0 14 19v1.5h-4V19a6.5 6.5 0 0 0-1.62-.67l-1.06 1.06-2.83-2.83 1.06-1.06A6.5 6.5 0 0 0 5 14H3.5v-4H5a6.5 6.5 0 0 0 .67-1.62L4.61 5.32l2.83-2.83 1.06 1.06A6.5 6.5 0 0 0 10 5Z" />
                      </g>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.5 6.5l3 3L11.5 18.5H8.5v-3L17.5 6.5Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 8l3 3M10 16l3 3" />
                    </svg>
                  </button>
                </div>
              )}
              <input type="hidden" name="date" value={selectedDate} />
              <input type="hidden" name="startTime" value={selectedSlotInfo?.startTime || ""} />
              <input type="hidden" name="endTime" value={selectedSlotInfo?.endTime || ""} />
            </div>
          )}
        </div>

        {/* Right: Session types + Calendar */}
        <div className="lg:max-w-[650px] lg:justify-self-end w-full lg:translate-x-[110px]">
          {/* Calendar */}
          <div className="mt-2 lg:mt-[80px] border border-aio-line p-5 sm:p-7 relative">
            {!selectedType && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center bg-aio-black/60 backdrop-blur-[1px]">
                <p className="text-sm font-semibold text-aio-muted max-w-[280px]">
                  Please choose your training path on the left to unlock the calendar.
                </p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                  className="mt-5 h-12 w-12 text-aio-muted/55"
                >
                  <rect x={4.5} y={10.5} width={15} height={10} rx={2} />
                  <path d="M8 10.5V7.75a4 4 0 0 1 8 0v2.75" />
                  <path d="M12 15v2" />
                </svg>
              </div>
            )}

            <div className={!selectedType ? "opacity-25 pointer-events-none" : ""}>
                {/* Month nav */}
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl sm:text-5xl font-black text-white leading-none">
                    {MONTHS[calMonth]} {calYear}
                  </h2>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={prevMonth}
                      className="flex h-10 sm:h-11 w-10 sm:w-11 items-center justify-center border border-aio-line text-aio-muted transition hover:border-aio-red hover:text-white"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={nextMonth}
                      className="flex h-10 sm:h-11 w-10 sm:w-11 items-center justify-center border border-aio-line text-aio-muted transition hover:border-aio-red hover:text-white"
                    >
                      →
                    </button>
                  </div>
                </div>

                {/* Day headers */}
                <div className="mt-8 grid grid-cols-7">
                  {DAYS.map((d, i) => (
                    <div
                      key={`${d}-${i}`}
                      className="py-2 sm:py-2.5 text-center text-sm font-black uppercase tracking-wider text-aio-muted"
                    >
                      {d}
                    </div>
                  ))}
                </div>

                {/* Day cells */}
                <div className="mt-2 grid grid-cols-7">
                  {calendarDays.map((day, i) => {
                    if (day === null) {
                      return <div key={`empty-${i}`} className="h-14 sm:h-[72px]" />;
                    }

                    const dateStr = formatDate(calYear, calMonth, day);
                    const isPast = dateStr < todayStr;
                    const isSelected = dateStr === selectedDate;
                    const isToday = dateStr === todayStr;
                    const isDisabled = isPast;

                    return (
                      <button
                        key={dateStr}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => {
                          setSelectedDate(dateStr);
                          setSelectedSlot("");
                        }}
                        className={`relative flex h-14 sm:h-[72px] items-center justify-center text-sm sm:text-lg font-bold transition ${
                          isSelected
                            ? "ring-1 ring-aio-red text-white"
                            : isDisabled
                              ? "cursor-not-allowed text-aio-muted/30"
                              : "cursor-pointer text-white/60 hover:bg-white/10"
                        }`}
                      >
                        {day}
                        {isToday && (
                          <span className="absolute bottom-3 h-2 w-2 rounded-full bg-aio-red" />
                        )}
                      </button>
                    );
                  })}
                </div>
            </div>
          </div>
        </div>
  </div>

      {/* Your Information + Athletes — only show after slot is picked */}
      {selectedSlot && (
        <div ref={parentInfoRef} className="mt-12 border-t border-aio-line pt-10">

          {/* ── Parent / Guardian ─────────────────────────── */}
          <h3 className="text-sm font-black uppercase tracking-[0.12em] text-aio-red-on-dark">
            Parent / Guardian Info
          </h3>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="booking-name" className={labelClass}>
                Full Name *
              </label>
              <div className="relative mt-2">
                <input
                  id="booking-name"
                  name="name"
                  placeholder="Jane Smith"
                  onChange={() => {
                    if (errors.name) {
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.name;
                        return next;
                      });
                    }
                  }}
                  className={`${inputClass} ${errors.name ? "border-aio-red" : ""}`}
                />
                {errors.name && (
                  <div className="mt-2.5 flex items-center gap-1.5 text-[0.7rem] font-black uppercase tracking-wider text-aio-red">
                    <svg className="h-3.5 w-3.5 text-aio-red shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>{errors.name}</span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="booking-email" className={labelClass}>
                Email *
              </label>
              <div className="relative mt-2">
                <input
                  id="booking-email"
                  name="email"
                  type="email"
                  placeholder="jane@example.com"
                  onChange={() => {
                    if (errors.email) {
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.email;
                        return next;
                      });
                    }
                  }}
                  className={`${inputClass} ${errors.email ? "border-aio-red" : ""}`}
                />
                {errors.email && (
                  <div className="mt-2.5 flex items-center gap-1.5 text-[0.7rem] font-black uppercase tracking-wider text-aio-red">
                    <svg className="h-3.5 w-3.5 text-aio-red shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="booking-phone" className={labelClass}>
                Phone (Optional)
              </label>
              <input
                id="booking-phone"
                name="phone"
                type="tel"
                placeholder="(555) 123-4567"
                className={`mt-2 ${inputClass}`}
              />
            </div>
            {selectedSlot === "custom" && (
              <div>
                <label htmlFor="booking-custom-time" className={labelClass}>
                  Preferred Time Slot *
                </label>
                <div className="relative mt-2">
                  <input
                    id="booking-custom-time"
                    name="customTime"
                    placeholder="e.g. 2:00 PM – 3:30 PM or Morning"
                    value={customTime}
                    onChange={(e) => {
                      setCustomTime(e.target.value);
                      if (errors.customTime) {
                        setErrors((prev) => {
                          const next = { ...prev };
                          delete next.customTime;
                          return next;
                        });
                      }
                    }}
                    className={`${inputClass} ${errors.customTime ? "border-aio-red" : ""}`}
                  />
                  {errors.customTime && (
                    <div className="mt-2.5 flex items-center gap-1.5 text-[0.7rem] font-black uppercase tracking-wider text-aio-red">
                      <svg className="h-3.5 w-3.5 text-aio-red shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span>{errors.customTime}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── Athletes ──────────────────────────────────── */}
          <div className="mt-10">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-[0.12em] text-aio-red-on-dark">
                Athletes{" "}
                <span className="ml-2 inline-flex h-5 w-5 items-center justify-center bg-aio-red-on-dark text-[0.6rem] font-black text-white">
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
                        Athlete Name *
                      </label>
                      <div className="relative mt-2">
                        <input
                          id={`athlete-name-${idx}`}
                          type="text"
                          placeholder="Athlete's name"
                          value={athlete.name}
                          onChange={(e) => updateAthlete(idx, "name", e.target.value)}
                          className={`${inputClass} ${errors[`athleteName_${idx}`] ? "border-aio-red" : ""}`}
                        />
                        {errors[`athleteName_${idx}`] && (
                          <div className="mt-2.5 flex items-center gap-1.5 text-[0.7rem] font-black uppercase tracking-wider text-aio-red">
                            <svg className="h-3.5 w-3.5 text-aio-red shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span>{errors[`athleteName_${idx}`]}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Age group */}
                    <div>
                      <label
                        htmlFor={`athlete-age-${idx}`}
                        className={labelClass}
                      >
                        Age Group *
                      </label>
                      <div className="relative mt-2">
                        {/* Custom Dropdown Trigger */}
                        <button
                          id={`athlete-age-select-trigger-${idx}`}
                          type="button"
                          onClick={() => {
                            setOpenAgeDropdownIdx(openAgeDropdownIdx === idx ? null : idx);
                            setOpenSportDropdownIdx(null);
                          }}
                          className={`flex w-full items-center justify-between border bg-aio-black/60 px-4 py-2.5 text-sm font-black uppercase tracking-[0.08em] text-white transition focus:outline-none ${
                            errors[`athleteAge_${idx}`] ? "border-aio-red" : "border-aio-line hover:border-aio-red"
                          }`}
                        >
                          <span>{athlete.ageGroup || "Select"}</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={3}
                            className={`h-4 w-4 text-white/70 transition-transform duration-200 ${
                              openAgeDropdownIdx === idx ? "rotate-180" : ""
                            }`}
                          >
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </button>

                        {/* Backdrop click listener to close dropdown */}
                        {openAgeDropdownIdx === idx && (
                          <div
                            className="fixed inset-0 z-20"
                            onClick={() => setOpenAgeDropdownIdx(null)}
                          />
                        )}

                        {/* Custom Dropdown Menu */}
                        <div
                          className={`absolute top-full left-0 z-30 mt-1 w-full bg-aio-black border border-aio-line p-2 shadow-[0_18px_40px_rgba(0,0,0,0.65)] transition duration-200 origin-top ${
                            openAgeDropdownIdx === idx
                              ? "visible opacity-100 scale-y-100"
                              : "invisible opacity-0 scale-y-95 pointer-events-none"
                          }`}
                        >
                          <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                            {ageGroups.map((a) => (
                              <button
                                key={a}
                                type="button"
                                onClick={() => {
                                  updateAthlete(idx, "ageGroup", a);
                                  setOpenAgeDropdownIdx(null);
                                }}
                                className={`block w-full text-left px-4 py-3 text-xs font-black uppercase tracking-[0.1em] transition-colors hover:bg-aio-panel ${
                                  athlete.ageGroup === a
                                    ? "text-aio-red bg-aio-panel/40"
                                    : "text-white/85 hover:text-aio-red"
                                }`}
                              >
                                {a}
                              </button>
                            ))}
                          </div>
                        </div>

                        {errors[`athleteAge_${idx}`] && (
                          <div className="mt-2.5 flex items-center gap-1.5 text-[0.7rem] font-black uppercase tracking-wider text-aio-red">
                            <svg className="h-3.5 w-3.5 text-aio-red shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span>{errors[`athleteAge_${idx}`]}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Sport */}
                    <div>
                      <label
                        htmlFor={`athlete-sport-${idx}`}
                        className={labelClass}
                      >
                        Sport *
                      </label>
                      <div className="relative mt-2">
                        {/* Custom Dropdown Trigger */}
                        <button
                          id={`athlete-sport-select-trigger-${idx}`}
                          type="button"
                          onClick={() => {
                            setOpenSportDropdownIdx(openSportDropdownIdx === idx ? null : idx);
                            setOpenAgeDropdownIdx(null);
                          }}
                          className={`flex w-full items-center justify-between border bg-aio-black/60 px-4 py-2.5 text-sm font-black uppercase tracking-[0.08em] text-white transition focus:outline-none ${
                            errors[`athleteSport_${idx}`] ? "border-aio-red" : "border-aio-line hover:border-aio-red"
                          }`}
                        >
                          <span>{athlete.sport || "Select"}</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={3}
                            className={`h-4 w-4 text-white/70 transition-transform duration-200 ${
                              openSportDropdownIdx === idx ? "rotate-180" : ""
                            }`}
                          >
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </button>

                        {/* Backdrop click listener to close dropdown */}
                        {openSportDropdownIdx === idx && (
                          <div
                            className="fixed inset-0 z-20"
                            onClick={() => setOpenSportDropdownIdx(null)}
                          />
                        )}

                        {/* Custom Dropdown Menu */}
                        <div
                          className={`absolute top-full left-0 z-30 mt-1 w-full bg-aio-black border border-aio-line p-2 shadow-[0_18px_40px_rgba(0,0,0,0.65)] transition duration-200 origin-top ${
                            openSportDropdownIdx === idx
                              ? "visible opacity-100 scale-y-100"
                              : "invisible opacity-0 scale-y-95 pointer-events-none"
                          }`}
                        >
                          <div className="max-h-[250px] overflow-y-auto custom-scrollbar">
                            {sports.map((s) => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => {
                                  updateAthlete(idx, "sport", s);
                                  setOpenSportDropdownIdx(null);
                                }}
                                className={`block w-full text-left px-4 py-3 text-xs font-black uppercase tracking-[0.1em] transition-colors hover:bg-aio-panel ${
                                  athlete.sport === s
                                    ? "text-aio-red bg-aio-panel/40"
                                    : "text-white/85 hover:text-aio-red"
                                }`}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>

                        {errors[`athleteSport_${idx}`] && (
                          <div className="mt-2.5 flex items-center gap-1.5 text-[0.7rem] font-black uppercase tracking-wider text-aio-red">
                            <svg className="h-3.5 w-3.5 text-aio-red shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span>{errors[`athleteSport_${idx}`]}</span>
                          </div>
                        )}
                      </div>
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
                    · {selectedSlot === "custom" ? (
                      customTime || "Custom Time Request"
                    ) : (
                      `${formatTime12(selectedSlotInfo.startTime)} – ${formatTime12(selectedSlotInfo.endTime)}`
                    )}
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
            {pending ? "Submitting…" : "Request Session"}
          </HoverButton>
        </div>
      )}
    </form>
  );
}
