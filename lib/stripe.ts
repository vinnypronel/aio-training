import Stripe from "stripe";

// Lazily initialized so the app can build/boot without Stripe configured;
// the key is only required when a checkout/webhook actually runs.
let client: Stripe | null = null;

function getStripeClient(): Stripe {
  if (!client) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY env var is not set");
    }
    client = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-06-24.dahlia",
    });
  }
  return client;
}

export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    const instance = getStripeClient();
    const value = instance[prop as keyof Stripe];
    return typeof value === "function" ? value.bind(instance) : value;
  },
});

// Football Clinic pricing config
const EARLY_DEADLINE = new Date("2026-07-15T23:59:59-04:00");

export function getClinicPriceId(): string {
  const now = new Date();
  if (now <= EARLY_DEADLINE) {
    return process.env.STRIPE_CLINIC_EARLY_PRICE_ID!;
  }
  return process.env.STRIPE_CLINIC_STANDARD_PRICE_ID!;
}

export function getClinicPriceCents(): number {
  const now = new Date();
  return now <= EARLY_DEADLINE ? 12500 : 15000; // $125 or $150
}

export function isEarlyRegistration(): boolean {
  return new Date() <= EARLY_DEADLINE;
}
