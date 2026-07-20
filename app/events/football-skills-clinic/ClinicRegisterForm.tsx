"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import HoverButton from "@/components/HoverButton";

// Load modal only when needed (avoids SSR issues with Stripe.js)
const CheckoutModal = dynamic(() => import("./CheckoutModal"), { ssr: false });

type AthleteEntry = {
  name: string;
  ageGroup: string;
  sport: string;
};

const sessionDays = [
  { value: "2026-07-25", label: "Saturday, July 25" },
  { value: "2026-07-26", label: "Sunday, July 26" },
];

const ageGroups = ["8-12", "13-18"];

const inputClass =
  "w-full border border-aio-line bg-transparent px-4 py-2.5 text-sm font-semibold text-white placeholder:text-aio-muted/50 transition focus:border-aio-red focus:outline-none";
const labelClass =
  "block text-[0.65rem] font-black uppercase tracking-[0.18em] text-white";

function emptyAthlete(): AthleteEntry {
  return { name: "", ageGroup: "", sport: "Football" };
}

export default function ClinicRegisterForm() {
  const [athletes, setAthletes] = useState<AthleteEntry[]>([emptyAthlete()]);
  const [parentName, setParentName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emergencyNotes, setEmergencyNotes] = useState("");
  const [selectedDays, setSelectedDays] = useState(sessionDays.map((day) => day.value));
  const [openAgeDropdownIdx, setOpenAgeDropdownIdx] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const pricePerAthletePerDay = 20;
  const dayCount = selectedDays.length;
  const completeAthletes = athletes.filter(
    (a) => a.name.trim().length > 0 && a.ageGroup.length > 0 && a.sport.length > 0
  );
  const athleteCount = completeAthletes.length;
  const total = pricePerAthletePerDay * athleteCount * dayCount;

  // Show summary only when parent info + at least one fully-filled athlete
  const showSummary =
    parentName.trim().length > 0 &&
    email.trim().includes("@") &&
    athleteCount > 0;

  function updateAthlete(idx: number, field: keyof AthleteEntry, value: string) {
    setAthletes((prev) =>
      prev.map((a, i) => (i === idx ? { ...a, [field]: value } : a))
    );
    // Clear error on interact
    const errKey = field === "name" ? `athleteName_${idx}` : `athleteAge_${idx}`;
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
    // Clean up corresponding athlete errors
    setErrors((prev) => {
      const next = { ...prev };
      delete next[`athleteName_${idx}`];
      delete next[`athleteAge_${idx}`];
      return next;
    });
  }

  function toggleDay(value: string) {
    setSelectedDays((prev) => {
      const next = prev.includes(value)
        ? prev.filter((day) => day !== value)
        : [...prev, value];
      return next.sort();
    });
    if (errors.days) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.days;
        return next;
      });
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setValidationError("");
    const newErrors: Record<string, string> = {};

    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }

    if (!parentName.trim()) {
      newErrors.parentName = "Please fill out this field.";
    }
    if (!email.trim()) {
      newErrors.email = "Please fill out this field.";
    } else if (!email.includes("@")) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (selectedDays.length === 0) {
      newErrors.days = "Please select at least one session day.";
    }

    // Validate each athlete
    athletes.forEach((athlete, idx) => {
      if (!athlete.name.trim()) {
        newErrors[`athleteName_${idx}`] = "Please fill out this field.";
      }
      if (!athlete.ageGroup) {
        newErrors[`athleteAge_${idx}`] = "Please select an option.";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Focus first error
      const firstError = Object.keys(newErrors)[0];
      if (firstError === "parentName") {
        document.getElementById("clinic-parent-name")?.focus();
      } else if (firstError === "email") {
        document.getElementById("clinic-email")?.focus();
      } else if (firstError.startsWith("athleteName_")) {
        const idx = firstError.split("_")[1];
        document.getElementById(`clinic-athlete-name-${idx}`)?.focus();
      } else if (firstError.startsWith("athleteAge_")) {
        const idx = firstError.split("_")[1];
        document.getElementById(`clinic-athlete-age-trigger-${idx}`)?.focus();
      }

      // Automatically hide validation alerts after 4 seconds
      validationTimeoutRef.current = setTimeout(() => {
        setErrors({});
      }, 4000);
      return;
    }

    setShowModal(true);
  }

  return (
    <>
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Parent / Guardian */}
        <div>
          <p className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-aio-red-on-dark">
            Parent / Guardian
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="clinic-parent-name" className={labelClass}>
                Full Name *
              </label>
              <div className="relative mt-2">
                <input
                  id="clinic-parent-name"
                  placeholder="Jane Smith"
                  value={parentName}
                  onChange={(e) => {
                    setParentName(e.target.value);
                    if (errors.parentName) {
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.parentName;
                        return next;
                      });
                    }
                  }}
                  className={`${inputClass} ${errors.parentName ? "border-aio-red" : ""}`}
                />
                {errors.parentName && (
                  <div className="absolute left-0 top-[calc(100%+8px)] z-50 flex items-center gap-2 border border-aio-red bg-aio-black px-4 py-2.5 text-[0.68rem] font-black uppercase tracking-wider text-white shadow-[0_12px_32px_rgba(0,0,0,0.65)]">
                    <div className="absolute -top-[9px] left-6 h-4 w-4 rotate-45 border-l border-t border-aio-red bg-aio-black" />
                    <svg className="h-4 w-4 text-aio-red shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>{errors.parentName}</span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="clinic-email" className={labelClass}>
                Email *
              </label>
              <div className="relative mt-2">
                <input
                  id="clinic-email"
                  type="email"
                  placeholder="jane@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
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
                  <div className="absolute left-0 top-[calc(100%+8px)] z-50 flex items-center gap-2 border border-aio-red bg-aio-black px-4 py-2.5 text-[0.68rem] font-black uppercase tracking-wider text-white shadow-[0_12px_32px_rgba(0,0,0,0.65)]">
                    <div className="absolute -top-[9px] left-6 h-4 w-4 rotate-45 border-l border-t border-aio-red bg-aio-black" />
                    <svg className="h-4 w-4 text-aio-red shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-4">
            <label htmlFor="clinic-phone" className={labelClass}>
              Phone
            </label>
            <input
              id="clinic-phone"
              type="tel"
              placeholder="(555) 123-4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`mt-2 ${inputClass} sm:max-w-[300px]`}
            />
          </div>
        </div>

        {/* Athletes */}
        <div className="border-t border-aio-line pt-6">
          <p className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-aio-red-on-dark">
            Athletes{" "}
            <span className="ml-2 inline-flex h-4 w-4 items-center justify-center bg-aio-red text-[0.55rem] font-black text-white">
              {athleteCount}
            </span>
          </p>

          <div className="mt-4 space-y-3">
            {athletes.map((athlete, idx) => (
              <div
                key={idx}
                className="border border-aio-line p-4 transition hover:border-aio-red/40"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[0.6rem] font-black uppercase tracking-[0.16em] text-aio-muted">
                    Athlete {idx + 1}
                  </span>
                  {athletes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAthlete(idx)}
                      aria-label={`Remove athlete ${idx + 1}`}
                      className="-my-2 flex min-h-11 items-center gap-1 px-2 text-[0.58rem] font-black uppercase tracking-[0.12em] text-aio-muted/60 transition hover:text-aio-red"
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

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor={`clinic-athlete-name-${idx}`} className={labelClass}>
                      Athlete Name *
                    </label>
                    <div className="relative mt-2">
                      <input
                        id={`clinic-athlete-name-${idx}`}
                        type="text"
                        placeholder="Athlete's name"
                        value={athlete.name}
                        onChange={(e) => updateAthlete(idx, "name", e.target.value)}
                        className={`${inputClass} ${errors[`athleteName_${idx}`] ? "border-aio-red" : ""}`}
                      />
                      {errors[`athleteName_${idx}`] && (
                        <div className="absolute left-0 top-[calc(100%+8px)] z-50 flex items-center gap-2 border border-aio-red bg-aio-black px-4 py-2.5 text-[0.68rem] font-black uppercase tracking-wider text-white shadow-[0_12px_32px_rgba(0,0,0,0.65)]">
                          <div className="absolute -top-[9px] left-6 h-4 w-4 rotate-45 border-l border-t border-aio-red bg-aio-black" />
                          <svg className="h-4 w-4 text-aio-red shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <span>{errors[`athleteName_${idx}`]}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label htmlFor={`clinic-athlete-age-${idx}`} className={labelClass}>
                      Age Group *
                    </label>
                    <div className="relative mt-2">
                      <button
                        id={`clinic-athlete-age-trigger-${idx}`}
                        type="button"
                        onClick={() => {
                          setOpenAgeDropdownIdx(openAgeDropdownIdx === idx ? null : idx);
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

                      {openAgeDropdownIdx === idx && (
                        <div
                          className="fixed inset-0 z-20"
                          onClick={() => setOpenAgeDropdownIdx(null)}
                        />
                      )}

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
                        <div className="absolute left-0 top-[calc(100%+8px)] z-50 flex items-center gap-2 border border-aio-red bg-aio-black px-4 py-2.5 text-[0.68rem] font-black uppercase tracking-wider text-white shadow-[0_12px_32px_rgba(0,0,0,0.65)]">
                          <div className="absolute -top-[9px] left-6 h-4 w-4 rotate-45 border-l border-t border-aio-red bg-aio-black" />
                          <svg className="h-4 w-4 text-aio-red shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <span>{errors[`athleteAge_${idx}`]}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addAthlete}
            className="mt-3 flex items-center gap-2 border border-dashed border-aio-line px-5 py-2.5 text-[0.62rem] font-black uppercase tracking-[0.16em] text-aio-muted transition hover:border-aio-red hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              className="h-3 w-3"
            >
              <line x1={12} y1={5} x2={12} y2={19} />
              <line x1={5} y1={12} x2={19} y2={12} />
            </svg>
            Add Another Athlete
          </button>
        </div>

        {/* Session Days */}
        <div className="border-t border-aio-line pt-6">
          <p className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-aio-red-on-dark">
            Session Days *
          </p>
          <p className="mt-2 text-xs font-semibold leading-relaxed text-aio-muted">
            $20 per athlete per day. Select both days for the full 2-day group session.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {sessionDays.map((day) => {
              const checked = selectedDays.includes(day.value);
              return (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => toggleDay(day.value)}
                  className={`flex items-center justify-between border px-4 py-3 text-left transition ${
                    checked
                      ? "border-aio-red bg-aio-red/10 text-white"
                      : "border-aio-line text-aio-muted hover:border-aio-red hover:text-white"
                  }`}
                >
                  <span className="text-xs font-black uppercase tracking-[0.12em]">
                    {day.label}
                  </span>
                  <span
                    className={`flex h-5 w-5 items-center justify-center border ${
                      checked ? "border-aio-red bg-aio-red" : "border-aio-line"
                    }`}
                  >
                    {checked && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={3}
                        className="h-3 w-3 text-white"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
          {errors.days && (
            <p className="mt-2 text-[0.68rem] font-black uppercase tracking-wider text-aio-red">
              {errors.days}
            </p>
          )}
        </div>

        {/* Emergency Info & Medical Notes */}
        <div className="border-t border-aio-line pt-6">
          <p className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-aio-red-on-dark">
            Emergency Info & Medical Notes
          </p>
          <div className="mt-4">
            <label htmlFor="clinic-emergency" className={labelClass}>
              Emergency Contact (Name/Phone) & any Medical Notes (Allergies, conditions, etc.)
            </label>
            <textarea
              id="clinic-emergency"
              placeholder="e.g. Emergency Contact: John Doe (555) 019-9234. Medical: None."
              value={emergencyNotes}
              onChange={(e) => setEmergencyNotes(e.target.value)}
              rows={3}
              className={`mt-2 resize-none ${inputClass}`}
            />
          </div>
        </div>

        {/* Order summary — only shown when form has parent info + an athlete name */}
        {showSummary && (
          <div className="border border-aio-line bg-aio-panel/40 p-4">
            <p className="text-[0.58rem] font-black uppercase tracking-[0.2em] text-aio-muted">
              Order Summary
            </p>
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-aio-body">
                  {athleteCount} Athlete{athleteCount > 1 ? "s" : ""} x {dayCount} Day{dayCount > 1 ? "s" : ""} x ${pricePerAthletePerDay}
                </span>
                <span className="text-sm font-black text-white">${total}</span>
              </div>
              <div className="flex items-center justify-between border-t border-aio-line pt-2">
                <span className="text-sm font-black text-white">Total Due</span>
                <span className="font-brand-display text-xl font-black text-white">${total}</span>
              </div>
            </div>
          </div>
        )}

        {/* Validation error */}
        {validationError && (
          <div className="flex items-center gap-2 border border-red-500/30 px-4 py-2.5">
            <p className="text-xs font-bold text-red-400">{validationError}</p>
          </div>
        )}

        <HoverButton type="submit" className="w-full py-4 sm:w-auto sm:px-12 sm:py-3.5">
          {athleteCount === 1
            ? `Pay $${total} - Secure Checkout`
            : `Pay $${total} - ${athleteCount} Athletes`}
        </HoverButton>

        <p className="flex items-center gap-1.5 text-[0.6rem] font-semibold text-aio-muted">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="h-3 w-3 shrink-0"
          >
            <rect x={3} y={11} width={18} height={11} rx={2} ry={2} />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Payments secured by Stripe - SSL encrypted - No account needed
        </p>
      </form>

      {/* Embedded Stripe Checkout Modal */}
      {showModal && (
        <CheckoutModal
          formData={{ parentName, email, phone, athletes, selectedDays, emergencyNotes }}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
