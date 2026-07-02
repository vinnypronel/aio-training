"use server";

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
  console.log("[contact-form] submission received:", {
    ...payload,
    receivedAt: new Date().toISOString(),
  });

  return {
    status: "success",
    message:
      "Message received. AIO will follow up with the athlete's next step.",
  };
}
