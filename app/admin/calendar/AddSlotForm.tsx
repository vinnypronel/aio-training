"use client";

import { useActionState, useRef, useState } from "react";
import { createTimeSlot } from "./actions";

const slotTypes = [
  { value: "private", label: "Private" },
  { value: "small-group", label: "Small Group" },
  { value: "large-group", label: "Large Group" },
  { value: "event", label: "Event" },
];

type FieldErrors = Partial<Record<"date" | "startTime" | "endTime" | "type", string>>;

export default function AddSlotForm({ defaultDate }: { defaultDate?: string }) {
  const [state, formAction, pending] = useActionState(createTimeSlot, null);
  const [open, setOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const formRef = useRef<HTMLFormElement>(null);

  const inputClass =
    "w-full border border-aio-line bg-aio-black/60 px-4 py-2.5 text-sm font-semibold text-white placeholder:text-aio-muted/50 transition focus:border-aio-red focus:outline-none";
  const labelClass =
    "block text-[0.65rem] font-black uppercase tracking-[0.18em] text-aio-muted";

  function validate(data: FormData): FieldErrors {
    const errors: FieldErrors = {};
    if (!data.get("date")) errors.date = "Date is required.";
    if (!data.get("startTime")) errors.startTime = "Start time is required.";
    if (!data.get("endTime")) errors.endTime = "End time is required.";
    if (!data.get("type")) errors.type = "Select a session type.";
    return errors;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const data = new FormData(e.currentTarget);
    const errors = validate(data);
    if (Object.keys(errors).length > 0) {
      e.preventDefault();
      setFieldErrors(errors);
    } else {
      setFieldErrors({});
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-8 inline-flex min-h-11 items-center justify-center gap-2 bg-aio-red px-6 text-xs font-black uppercase tracking-[0.1em] text-white transition hover:bg-aio-red-hover"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          className="h-4 w-4"
        >
          <line x1={12} y1={5} x2={12} y2={19} />
          <line x1={5} y1={12} x2={19} y2={12} />
        </svg>
        Add Time Slot
      </button>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black uppercase tracking-[0.12em] text-aio-red">
          New Time Slot
        </h3>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs font-bold uppercase tracking-wider text-aio-muted transition hover:text-white"
        >
          Cancel
        </button>
      </div>
      <form
        ref={formRef}
        action={formAction}
        onSubmit={handleSubmit}
        noValidate
        className="mt-4 space-y-5 border border-aio-line bg-aio-panel p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="slot-date" className={labelClass}>
              Date
            </label>
            <input
              id="slot-date"
              name="date"
              type="date"
              defaultValue={defaultDate}
              className={`mt-2 ${inputClass} ${fieldErrors.date ? "border-aio-red" : ""}`}
            />
            {fieldErrors.date && (
              <p className="mt-1.5 text-[0.65rem] font-black uppercase tracking-[0.12em] text-aio-red-on-dark">
                {fieldErrors.date}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="slot-start" className={labelClass}>
              Start Time
            </label>
            <input
              id="slot-start"
              name="startTime"
              type="time"
              className={`mt-2 ${inputClass} ${fieldErrors.startTime ? "border-aio-red" : ""}`}
            />
            {fieldErrors.startTime && (
              <p className="mt-1.5 text-[0.65rem] font-black uppercase tracking-[0.12em] text-aio-red-on-dark">
                {fieldErrors.startTime}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="slot-end" className={labelClass}>
              End Time
            </label>
            <input
              id="slot-end"
              name="endTime"
              type="time"
              className={`mt-2 ${inputClass} ${fieldErrors.endTime ? "border-aio-red" : ""}`}
            />
            {fieldErrors.endTime && (
              <p className="mt-1.5 text-[0.65rem] font-black uppercase tracking-[0.12em] text-aio-red-on-dark">
                {fieldErrors.endTime}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="slot-type" className={labelClass}>
              Type
            </label>
            <select
              id="slot-type"
              name="type"
              className={`mt-2 ${inputClass} ${fieldErrors.type ? "border-aio-red" : ""}`}
            >
              <option value="">Select type</option>
              {slotTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            {fieldErrors.type && (
              <p className="mt-1.5 text-[0.65rem] font-black uppercase tracking-[0.12em] text-aio-red-on-dark">
                {fieldErrors.type}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="slot-title" className={labelClass}>
              Title (Optional)
            </label>
            <input
              id="slot-title"
              name="title"
              placeholder="e.g. Football Skills Session"
              className={`mt-2 ${inputClass}`}
            />
          </div>
          <div>
            <label htmlFor="slot-capacity" className={labelClass}>
              Max Capacity
            </label>
            <input
              id="slot-capacity"
              name="maxCapacity"
              type="number"
              min={1}
              defaultValue={1}
              className={`mt-2 ${inputClass}`}
            />
          </div>
        </div>

        {state?.error && (
          <div className="flex items-center gap-3 border-l-2 border-aio-red bg-aio-red/10 px-4 py-3">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-aio-red-on-dark">
              {state.error}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full bg-aio-red py-3 text-sm font-black uppercase tracking-[0.1em] text-white transition hover:bg-aio-red-hover disabled:opacity-50 sm:w-auto sm:px-8"
        >
          {pending ? "Adding…" : "Add Slot"}
        </button>
      </form>
    </div>
  );
}
