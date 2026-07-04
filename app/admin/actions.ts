"use server";

import { timingSafeEqual } from "node:crypto";
import { createSession, deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";

// In-memory throttle. Fine for a single-instance deploy; swap for a shared
// store (Redis/Upstash) if the app is ever scaled horizontally.
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

function safeEqual(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

export async function login(
  _prev: { error: string } | null,
  formData: FormData
) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const key = email.toLowerCase();
  const entry = attempts.get(key);
  if (entry && entry.count >= MAX_ATTEMPTS && Date.now() < entry.resetAt) {
    return { error: "Too many attempts. Try again in 15 minutes." };
  }

  const ok =
    safeEqual(email, process.env.ADMIN_EMAIL ?? "") &&
    safeEqual(password, process.env.ADMIN_PASSWORD ?? "");

  if (!ok) {
    const base =
      entry && Date.now() < entry.resetAt
        ? entry
        : { count: 0, resetAt: Date.now() + WINDOW_MS };
    attempts.set(key, { count: base.count + 1, resetAt: base.resetAt });
    return { error: "Invalid credentials." };
  }

  attempts.delete(key);
  await createSession(email);
  redirect("/admin/dashboard");
}

export async function logout() {
  await deleteSession();
  redirect("/admin");
}
