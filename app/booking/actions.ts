"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type BookingFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

type AthleteEntry = {
  name: string;
  ageGroup: string;
  sport: string;
};

export async function submitBooking(
  _prev: BookingFormState,
  formData: FormData,
): Promise<BookingFormState> {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim() || "";
  const type = (formData.get("type") as string)?.trim();
  const date = (formData.get("date") as string)?.trim();
  const startTime = (formData.get("startTime") as string)?.trim();
  const endTime = (formData.get("endTime") as string)?.trim();
  const athletesRaw = (formData.get("athletes") as string)?.trim() || "[]";

  if (!name || !email || !type || !date || !startTime || !endTime) {
    return { status: "error", message: "Name, email, training type, date, and time slot are required." };
  }

  // Parse athlete list
  let athletes: AthleteEntry[] = [];
  try {
    athletes = JSON.parse(athletesRaw);
    if (!Array.isArray(athletes) || athletes.length === 0) {
      athletes = [{ name: "", ageGroup: "", sport: "" }];
    }
  } catch {
    athletes = [{ name: "", ageGroup: "", sport: "" }];
  }

  const athleteCount = athletes.length;

  // Pull first athlete's info for the customer record (primary athlete)
  const primaryAthlete = athletes[0];
  const ageGroup = primaryAthlete?.ageGroup || "";
  const sport = primaryAthlete?.sport || "";

  // Build a readable notes string stored on the booking
  const athleteSummaryLines = athletes.map((a, i) => {
    const parts: string[] = [];
    if (a.name) parts.push(a.name);
    if (a.ageGroup) parts.push(`Ages ${a.ageGroup}`);
    if (a.sport) parts.push(a.sport);
    return `Athlete ${i + 1}: ${parts.length ? parts.join(", ") : "No details provided"}`;
  });
  const notes = `Athletes: ${athleteCount}\n${athleteSummaryLines.join("\n")}`;

  // Upsert customer (parent/guardian)
  let customer = await prisma.customer.findUnique({ where: { email } });
  if (!customer) {
    customer = await prisma.customer.create({
      data: { name, email, phone, ageGroup, sport },
    });
  } else {
    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        name,
        ...(phone && { phone }),
        ...(ageGroup && { ageGroup }),
        ...(sport && { sport }),
      },
    });
  }
  const customerId = customer.id;

  // When a slot is chosen, re-check capacity, create the booking, and increment
  // the counter inside one transaction so two concurrent submissions can't both
  // claim the last spot.
  try {
    await prisma.$transaction(async (tx) => {
      let slot = await tx.timeSlot.findFirst({
        where: {
          date,
          startTime,
          endTime,
          type,
        },
      });

      if (!slot) {
        slot = await tx.timeSlot.create({
          data: {
            date,
            startTime,
            endTime,
            type,
            title: `${type} Request`,
            maxCapacity: 99,
            bookedCount: athleteCount,
          },
        });
      } else {
        await tx.timeSlot.update({
          where: { id: slot.id },
          data: { bookedCount: { increment: athleteCount } },
        });
      }

      await tx.booking.create({
        data: {
          type,
          status: "new",
          notes,
          customerId,
          timeSlotId: slot.id,
        },
      });
    });
  } catch (e) {
    return {
      status: "error",
      message:
        e instanceof Error ? e.message : "Booking failed. Please try again.",
    };
  }

  revalidatePath("/admin/bookings");
  revalidatePath("/admin/calendar");
  revalidatePath("/booking");

  const athleteWord = athleteCount === 1 ? "athlete" : "athletes";
  return {
    status: "success",
    message: `Booking submitted for ${athleteCount} ${athleteWord}! AIO will reach out to confirm your spot${athleteCount > 1 ? "s" : ""} and go over payment.`,
  };
}
