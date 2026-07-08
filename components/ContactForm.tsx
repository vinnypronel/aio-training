"use client";

import { useState, useRef, useTransition } from "react";
import {
  submitContactForm,
  type ContactFormState,
  type ContactPayload,
} from "@/app/contact-us/actions";
import HoverButton from "@/components/HoverButton";
import { track } from "@/lib/pixel";

const ageGroups = ["8-12", "13-18"];
const programs = [
  "Baseball",
  "Football",
  "Basketball",
  "Soccer",
  "Personal Training",
  "Team Training",
  "Not Sure Yet",
];

const emptyForm: ContactPayload = {
  fullName: "",
  email: "",
  phone: "",
  athleteAge: "",
  interestedIn: "",
  message: "",
};

export default function ContactForm() {
  const [form, setForm] = useState<ContactPayload>(emptyForm);
  const [honeypot, setHoneypot] = useState("");
  const [state, setState] = useState<ContactFormState>({
    status: "idle",
    message: "",
  });
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  function update<K extends keyof ContactPayload>(
    key: K,
    value: ContactPayload[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (honeypot.trim() !== "") {
      return;
    }

    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }

    const newErrors: Record<string, string> = {};
    if (!form.fullName.trim()) {
      newErrors.fullName = "Please fill out this field.";
    }
    if (!form.email.trim()) {
      newErrors.email = "Please fill out this field.";
    } else if (!form.email.includes("@")) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Focus first error
      const firstError = Object.keys(newErrors)[0];
      if (firstError === "fullName") {
        document.getElementById("contact-full-name")?.focus();
      } else if (firstError === "email") {
        document.getElementById("contact-email")?.focus();
      }

      // Automatically hide validation alerts after 4 seconds
      validationTimeoutRef.current = setTimeout(() => {
        setErrors({});
      }, 4000);
      return;
    }

    startTransition(async () => {
      const next = await submitContactForm(state, form);
      setState(next);
      if (next.status === "success") {
        setForm(emptyForm);
        // Consent-gated: no-op unless the visitor accepted measurement.
        track("Lead", { content_name: "contact-form" });
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="relative mt-6 space-y-5 border border-aio-line p-6 md:p-8"
    >
      <Field
        label="Full Name"
        id="contact-full-name"
        value={form.fullName}
        onChange={(v) => update("fullName", v)}
        autoComplete="name"
        required
        error={errors.fullName}
      />
      <Field
        label="Email Address"
        id="contact-email"
        type="email"
        value={form.email}
        onChange={(v) => update("email", v)}
        autoComplete="email"
        required
        error={errors.email}
      />
      <Field
        label="Phone Number"
        id="contact-phone"
        type="tel"
        value={form.phone}
        onChange={(v) => update("phone", v)}
        autoComplete="tel"
      />

      <div className="grid gap-5 md:grid-cols-2">
        <Select
          label="Athlete Age"
          id="contact-athlete-age"
          value={form.athleteAge}
          onChange={(v) => update("athleteAge", v)}
          placeholder="Select age group"
          options={ageGroups}
        />
        <Select
          label="Interested In"
          id="contact-interested-in"
          value={form.interestedIn}
          onChange={(v) => update("interestedIn", v)}
          placeholder="Select program"
          options={programs}
        />
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="block text-xs font-black uppercase tracking-[0.18em] text-aio-red-on-dark"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          className="mt-2 w-full border border-aio-line bg-aio-black p-3 text-sm font-semibold text-white placeholder:text-aio-muted focus:border-aio-red focus:outline-none focus:ring-2 focus:ring-aio-red/40"
        />
      </div>

      <input
        type="text"
        name="leave-blank"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="hidden"
      />

      <HoverButton type="submit" disabled={isPending} className="w-full sm:w-auto">
        {isPending ? "Sending…" : "Send Message"}
      </HoverButton>

      {state.status === "error" && (
        <p role="status" className="text-sm font-semibold text-red-400">
          {state.message}
        </p>
      )}

      {state.status === "success" && (
        <div
          role="status"
          className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-aio-black/95 px-6 py-10 text-center backdrop-blur-sm"
        >
          <button
            type="button"
            onClick={() => setState({ status: "idle", message: "" })}
            aria-label="Close confirmation"
            className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center text-white/60 transition hover:text-aio-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aio-red"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              className="h-5 w-5"
            >
              <line x1={18} y1={6} x2={6} y2={18} />
              <line x1={6} y1={6} x2={18} y2={18} />
            </svg>
          </button>

          <div className="h-1 w-12 -skew-x-[18deg] bg-aio-red" />
          <p className="mt-5 text-xs font-black uppercase tracking-[0.28em] text-aio-red">
            Message Sent
          </p>

          <div className="mt-6 flex h-16 w-16 items-center justify-center border-2 border-aio-red">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              className="h-8 w-8 text-aio-red"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" />
            </svg>
          </div>

          <h3 className="mt-6 font-brand-display text-[clamp(2rem,6vw,3.25rem)] font-black uppercase leading-[0.9] text-white">
            Message<br />
            <span className="text-aio-red">Received</span>
          </h3>

          <p className="mt-4 max-w-[420px] text-sm font-semibold leading-7 text-aio-body">
            {state.message}
          </p>

          <button
            type="button"
            onClick={() => setState({ status: "idle", message: "" })}
            className="mt-8 text-xs font-black uppercase tracking-[0.16em] text-white/70 underline decoration-aio-red decoration-2 underline-offset-4 transition hover:text-white"
          >
            Send Another Message
          </button>
        </div>
      )}
    </form>
  );
}

function Field({
  label,
  id,
  value,
  onChange,
  type = "text",
  required = false,
  autoComplete,
  error,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  error?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-black uppercase tracking-[0.18em] text-aio-red-on-dark"
      >
        {label}
        {required && <span aria-hidden> *</span>}
      </label>
      <div className="relative mt-2">
        <input
          id={id}
          name={id}
          type={type}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full border bg-aio-black p-3 text-sm font-semibold text-white placeholder:text-aio-muted focus:outline-none focus:ring-2 focus:ring-aio-red/40 ${
            error ? "border-aio-red" : "border-aio-line focus:border-aio-red"
          }`}
        />
        {error && (
          <div className="absolute left-0 top-[calc(100%+8px)] z-50 flex items-center gap-2 border border-aio-red bg-aio-black px-4 py-2.5 text-[0.68rem] font-black uppercase tracking-wider text-white shadow-[0_12px_32px_rgba(0,0,0,0.65)]">
            <div className="absolute -top-[9px] left-6 h-4 w-4 rotate-45 border-l border-t border-aio-red bg-aio-black" />
            <svg className="h-4 w-4 text-aio-red shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function Select({
  label,
  id,
  value,
  onChange,
  placeholder,
  options,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: string[];
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-black uppercase tracking-[0.18em] text-aio-red-on-dark"
      >
        {label}
      </label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full border border-aio-line bg-aio-black p-3 text-sm font-semibold text-white focus:border-aio-red focus:outline-none focus:ring-2 focus:ring-aio-red/40"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
