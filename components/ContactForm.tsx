"use client";

import { useState, useTransition } from "react";
import {
  submitContactForm,
  type ContactFormState,
  type ContactPayload,
} from "@/app/contact-us/actions";
import HoverButton from "@/components/HoverButton";

const ageGroups = ["8-10", "11-13", "14-16", "17-18"];
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

  function update<K extends keyof ContactPayload>(
    key: K,
    value: ContactPayload[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (honeypot.trim() !== "") {
      return;
    }
    startTransition(async () => {
      const next = await submitContactForm(state, form);
      setState(next);
      if (next.status === "success") {
        setForm(emptyForm);
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 space-y-5 border border-aio-line p-6 md:p-8"
    >
      <Field
        label="Full Name"
        id="contact-full-name"
        value={form.fullName}
        onChange={(v) => update("fullName", v)}
        required
      />
      <Field
        label="Email Address"
        id="contact-email"
        type="email"
        value={form.email}
        onChange={(v) => update("email", v)}
        required
      />
      <Field
        label="Phone Number"
        id="contact-phone"
        type="tel"
        value={form.phone}
        onChange={(v) => update("phone", v)}
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

      {state.status !== "idle" && (
        <p
          role="status"
          className={`text-sm font-semibold ${
            state.status === "success" ? "text-aio-red-on-dark" : "text-red-400"
          }`}
        >
          {state.message}
        </p>
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
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
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
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full border border-aio-line bg-aio-black p-3 text-sm font-semibold text-white placeholder:text-aio-muted focus:border-aio-red focus:outline-none focus:ring-2 focus:ring-aio-red/40"
      />
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
