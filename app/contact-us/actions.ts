"use server";

import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

export type ContactPayload = {
  fullName: string;
  email: string;
  phone: string;
  athleteAge: string;
  interestedIn: string;
  message: string;
};

export async function submitContactForm(
  _prev: ContactFormState,
  payload: ContactPayload,
): Promise<ContactFormState> {
  const fullName = payload.fullName?.trim();
  const email = payload.email?.trim();

  if (!fullName || !email || !email.includes("@")) {
    return {
      status: "error",
      message: "Please provide your name and a valid email address.",
    };
  }

  // Throttle spam: 5 messages per 10 minutes per IP.
  const limit = await rateLimit("contact", { max: 5, windowMs: 10 * 60 * 1000 });
  if (!limit.ok) {
    return {
      status: "error",
      message: "Too many messages sent. Please wait a few minutes and try again.",
    };
  }

  try {
    await prisma.contactMessage.create({
      data: {
        fullName,
        email,
        phone: payload.phone?.trim() || "",
        athleteAge: payload.athleteAge || "",
        interestedIn: payload.interestedIn || "",
        message: payload.message?.trim().slice(0, 5000) || "",
      },
    });
  } catch {
    return {
      status: "error",
      message: "Something went wrong sending your message. Please call (714) 440-8053.",
    };
  }

  return {
    status: "success",
    message:
      "Message received. AIO will follow up with the athlete's next step.",
  };
}
