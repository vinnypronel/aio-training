"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import HoverButton from "@/components/HoverButton";

// Load modal only when needed (avoids SSR issues with Stripe.js)
const CheckoutModal = dynamic(() => import("./CheckoutModal"), { ssr: false });

// Inline early-registration check (safe to run client-side)
const EARLY_DEADLINE = new Date("2026-07-15T23:59:59-04:00");
function isEarlyRegistration() {
  return new Date() <= EARLY_DEADLINE;
}

type AthleteEntry = {
  name: string;
  ageGroup: string;
  sport: string;
};

const ageGroups = ["8-10 (Youth)", "11-12 (Youth)", "13-18 (Teen)"];
const sports = ["Football", "Baseball", "Basketball", "Soccer", "Personal Training", "Not Sure Yet"];

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
  const [showModal, setShowModal] = useState(false);
  const [validationError, setValidationError] = useState("");

  const isEarly = isEarlyRegistration();
  const pricePerAthlete = isEarly ? 125 : 150;
  const completeAthletes = athletes.filter(
    (a) => a.name.trim().length > 0 && a.ageGroup.length > 0 && a.sport.length > 0
  );
  const athleteCount = completeAthletes.length;
  const total = pricePerAthlete * athleteCount;

  // Show summary only when parent info + at least one fully-filled athlete
  const showSummary =
    parentName.trim().length > 0 &&
    email.trim().includes("@") &&
    athleteCount > 0;


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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setValidationError("");

    if (!parentName.trim()) {
      setValidationError("Parent name is required.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setValidationError("A valid email address is required.");
      return;
    }

    setShowModal(true);
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
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
              <input
                id="clinic-parent-name"
                required
                placeholder="Jane Smith"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                className={`mt-2 ${inputClass}`}
              />
            </div>
            <div>
              <label htmlFor="clinic-email" className={labelClass}>
                Email *
              </label>
              <input
                id="clinic-email"
                type="email"
                required
                placeholder="jane@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`mt-2 ${inputClass}`}
              />
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
                      Athlete Name
                    </label>
                    <input
                      id={`clinic-athlete-name-${idx}`}
                      type="text"
                      placeholder="Athlete's name"
                      value={athlete.name}
                      onChange={(e) => updateAthlete(idx, "name", e.target.value)}
                      className={`mt-2 ${inputClass}`}
                    />
                  </div>
                  <div>
                    <label htmlFor={`clinic-athlete-age-${idx}`} className={labelClass}>
                      Age Group
                    </label>
                    <select
                      id={`clinic-athlete-age-${idx}`}
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
                  {athleteCount} Athlete{athleteCount > 1 ? "s" : ""} × ${pricePerAthlete}
                </span>
                <span className="text-sm font-black text-white">${total}</span>
              </div>
              <div className="flex items-center justify-between border-t border-aio-line pt-2">
                <span className="text-sm font-black text-white">Total Due</span>
                <span className="font-brand-display text-xl font-black text-white">${total}</span>
              </div>
            </div>
            {isEarly && (
              <p className="mt-2 text-[0.58rem] font-semibold text-aio-red">
                ✓ Early registration rate locked in at checkout
              </p>
            )}
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
            ? `Pay $${total} · Secure Checkout`
            : `Pay $${total} · ${athleteCount} Athletes`}
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
          Payments secured by Stripe · SSL encrypted · No account needed
        </p>
      </form>

      {/* Embedded Stripe Checkout Modal */}
      {showModal && (
        <CheckoutModal
          formData={{ parentName, email, phone, athletes, emergencyNotes }}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
