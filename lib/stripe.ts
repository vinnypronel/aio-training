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

// Football skills group session pricing config

export function getClinicPriceCents(): number {
  return 2000; // $20
}
