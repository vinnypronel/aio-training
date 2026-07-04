"use server";

import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTimeSlot(
  _prev: { error: string } | null,
  formData: FormData,
) {
  const session = await getSession();
  if (!session) redirect("/admin");

  const date = (formData.get("date") as string)?.trim();
  const startTime = (formData.get("startTime") as string)?.trim();
  const endTime = (formData.get("endTime") as string)?.trim();
  const type = (formData.get("type") as string)?.trim();
  const title = (formData.get("title") as string)?.trim() || "";
  const maxCapacity = parseInt(formData.get("maxCapacity") as string) || 1;

  if (!date || !startTime || !endTime || !type) {
    return { error: "Date, start time, end time, and type are required." };
  }

  await prisma.timeSlot.create({
    data: { date, startTime, endTime, type, title, maxCapacity },
  });

  revalidatePath("/admin/calendar");
  return null;
}

export async function deleteTimeSlot(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/admin");

  const id = formData.get("id") as string;
  if (!id) return;

  const slot = await prisma.timeSlot.findUnique({
    where: { id },
    include: { bookings: true },
  });

  if (!slot) return;

  if (slot.bookings.length > 0) {
    return;
  }

  await prisma.timeSlot.delete({ where: { id } });
  revalidatePath("/admin/calendar");
}
