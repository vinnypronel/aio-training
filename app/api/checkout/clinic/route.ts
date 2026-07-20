import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { stripe, getClinicPriceCents } from "@/lib/stripe";
import { prisma } from "@/lib/db";

type AthleteEntry = {
  name: string;
  ageGroup: string;
  sport: string;
};

const allowedSessionDays = new Set(["2026-07-25", "2026-07-26"]);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      parentName,
      email,
      phone,
      athletes: athletesRaw,
      selectedDays: selectedDaysRaw,
      emergencyNotes,
    } = body;

    if (!parentName || !email) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }

    let athletes: AthleteEntry[] = [];
    try {
      athletes = Array.isArray(athletesRaw) ? athletesRaw : JSON.parse(athletesRaw || "[]");
      if (athletes.length === 0) athletes = [{ name: "", ageGroup: "", sport: "Football" }];
    } catch {
      athletes = [{ name: "", ageGroup: "", sport: "Football" }];
    }

    const athleteCount = athletes.length;
    const primaryAthlete = athletes[0];
    let selectedDays = Array.isArray(selectedDaysRaw)
      ? selectedDaysRaw.filter(
          (day: unknown): day is string =>
            typeof day === "string" && allowedSessionDays.has(day),
        )
      : [];
    if (selectedDays.length === 0) {
      selectedDays = ["2026-07-25", "2026-07-26"];
    }
    selectedDays = Array.from(new Set(selectedDays)).sort();
    const dayCount = selectedDays.length;
    const priceLabel = "$20 per athlete per day";

    const athleteSummaryLines = athletes.map((a, i) => {
      const parts: string[] = [];
      if (a.name) parts.push(a.name);
      if (a.ageGroup) parts.push(`Ages ${a.ageGroup}`);
      if (a.sport) parts.push(a.sport);
      return `Athlete ${i + 1}: ${parts.length ? parts.join(", ") : "No details provided"}`;
    });
    const notesLines = [
      `Event: AIO Football Skills Group Session - July 25-26, 2026`,
      `Pricing: ${priceLabel}`,
      `Athletes: ${athleteCount}`,
      `Selected Days: ${selectedDays.join(", ")}`,
      `Day Count: ${dayCount}`,
      ...athleteSummaryLines,
    ];
    if (emergencyNotes && String(emergencyNotes).trim().length > 0) {
      notesLines.push(`Emergency Notes: ${String(emergencyNotes).trim().slice(0, 2000)}`);
    }
    const notes = notesLines.join("\n");

    // Upsert customer
    let customer = await prisma.customer.findUnique({ where: { email } });
    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: parentName,
          email,
          phone: phone || "",
          ageGroup: primaryAthlete?.ageGroup || "",
          sport: primaryAthlete?.sport || "Football",
        },
      });
    } else {
      await prisma.customer.update({
        where: { id: customer.id },
        data: { name: parentName, ...(phone && { phone }) },
      });
    }

    // Find event
    const event = await prisma.event.findUnique({
      where: { slug: "football-skills-clinic" },
    });

    // Save booking with pending_payment status
    const booking = await prisma.booking.create({
      data: {
        type: "event",
        status: "pending_payment",
        notes,
        customerId: customer.id,
        timeSlotId: null,
        eventId: event?.id ?? null,
      },
    });

    const origin =
      req.headers.get("origin") ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://www.trainingaio.com";
    const priceCents = getClinicPriceCents();

    // Charge the raw amount so the price shown on the site always matches what
    // Stripe charges. This intentionally bypasses the Stripe Price IDs so the
    // amount is controlled in one place (getClinicPriceCents).
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      [
            {
              quantity: athleteCount * dayCount,
              price_data: {
                currency: "usd",
                unit_amount: priceCents,
                product_data: {
                  name: "AIO Football Skills Group Session Registration",
                  description: `July 25-26, 2026 - Heavenly Farms Park - ${athleteCount} athlete${athleteCount > 1 ? "s" : ""} - ${dayCount} day${dayCount > 1 ? "s" : ""}`,
                },
              },
            },
          ];

    // Create Stripe Embedded Checkout Session
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await (stripe.checkout.sessions.create as any)({
      ui_mode: "embedded_page",
      line_items: lineItems,
      mode: "payment",
      return_url: `${origin}/events/football-skills-clinic/success?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        bookingId: booking.id,
        customerId: customer.id,
        athleteCount: String(athleteCount),
        dayCount: String(dayCount),
        selectedDays: selectedDays.join(","),
        eventSlug: "football-skills-clinic",
      },
      customer_email: email,
    });

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session." },
      { status: 500 },
    );
  }
}
