"use server";

import { timingSafeEqual } from "node:crypto";
import { createSession, deleteSession } from "@/lib/session";
import { rateLimit, clearLimit } from "@/lib/rate-limit";
import { redirect } from "next/navigation";

const MAX_ATTEMPTS = 8;
const WINDOW_MS = 15 * 60 * 1000;

function safeEqual(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

// Admin accounts are configured in pairs. Account 1 uses ADMIN_EMAIL /
// ADMIN_PASSWORD; Jon's account uses JON_EMAIL / JON_PASSWORD.
function getAdminAccounts(): { email: string; password: string }[] {
  const accounts: { email: string; password: string }[] = [];
  const pairs: [string | undefined, string | undefined][] = [
    [process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD],
    [process.env.JON_EMAIL, process.env.JON_PASSWORD],
  ];
  for (const [email, password] of pairs) {
    if (email && password) {
      accounts.push({ email, password });
    }
  }
  return accounts;
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

  // Durable throttle keyed by the submitted email. Every attempt counts; a
  // successful login resets the counter.
  const key = email.toLowerCase();
  const limit = await rateLimit(
    "login",
    { max: MAX_ATTEMPTS, windowMs: WINDOW_MS },
    key,
  );
  if (!limit.ok) {
    return { error: "Too many attempts. Try again in 15 minutes." };
  }

  // Check every configured account without short-circuiting, so timing does
  // not reveal which account (if any) matched the email.
  let ok = false;
  for (const account of getAdminAccounts()) {
    if (safeEqual(email, account.email) && safeEqual(password, account.password)) {
      ok = true;
    }
  }

  if (!ok) {
    return { error: "Invalid credentials." };
  }

  await clearLimit("login", key);
  await createSession(email);
  redirect("/admin/dashboard");
}

export async function logout() {
  await deleteSession();
  redirect("/admin");
}
