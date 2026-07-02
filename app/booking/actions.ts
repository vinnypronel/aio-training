"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export type BookingFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function submitBooking(
  _prev: BookingFormState,
  formData: FormData,
): Promise<BookingFormState> {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim() || "";
  const ageGroup = (formData.get("ageGroup") as string)?.trim() || "";
  const sport = (formData.get("sport") as string)?.trim() || "";
  const slotId = (formData.get("slotId") as string)?.trim();
  const type = (formData.get("type") as string)?.trim();

  if (!name || !email || !type) {
    return { status: "error", message: "Name, email, and session type are required." };
  }

  if (slotId) {
    const slot = await prisma.timeSlot.findUnique({ where: { id: slotId } });
    if (!slot) {
      return { status: "error", message: "Time slot not found." };
    }
    if (slot.bookedCount >= slot.maxCapacity) {
      return { status: "error", message: "This time slot is full." };
    }
  }

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

  await prisma.booking.create({
    data: {
      type,
      status: "new",
      customerId: customer.id,
      timeSlotId: slotId || null,
    },
  });

  if (slotId) {
    await prisma.timeSlot.update({
      where: { id: slotId },
      data: { bookedCount: { increment: 1 } },
    });
  }

  revalidatePath("/admin/bookings");
  revalidatePath("/admin/calendar");
  revalidatePath("/booking");

  return {
    status: "success",
    message: "Booking submitted! AIO will reach out to confirm your spot.",
  };
}
