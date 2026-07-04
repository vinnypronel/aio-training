"use server";

import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const validStatuses = ["new", "contacted", "confirmed", "completed", "cancelled"];

export async function updateBookingStatus(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/admin");

  const id = formData.get("id") as string;
  const status = formData.get("status") as string;

  if (!id || !validStatuses.includes(status)) return;

  await prisma.booking.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/admin/bookings");
}

export async function deleteBooking(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/admin");

  const id = formData.get("id") as string;
  if (!id) return;

  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) return;

  if (booking.timeSlotId) {
    await prisma.timeSlot.update({
      where: { id: booking.timeSlotId },
      data: { bookedCount: { decrement: 1 } },
    });
  }

  await prisma.booking.delete({ where: { id } });
  revalidatePath("/admin/bookings");
}
