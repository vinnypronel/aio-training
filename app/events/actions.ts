"use server";

import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeFile, mkdir, unlink } from "node:fs/promises";
import path from "node:path";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createEvent(
  _prev: { error: string } | null,
  formData: FormData
) {
  const session = await getSession();
  if (!session) redirect("/admin");

  const title = (formData.get("title") as string)?.trim();
  const tag = (formData.get("tag") as string)?.trim();
  const badge = (formData.get("badge") as string)?.trim();
  const date = (formData.get("date") as string)?.trim();
  const location = (formData.get("location") as string)?.trim();
  const price = (formData.get("price") as string)?.trim();
  const flyer = formData.get("flyer") as File | null;

  const sessionLabels = formData.getAll("sessionLabel") as string[];
  const sessionTimes = formData.getAll("sessionTime") as string[];

  if (!title || !tag || !badge || !date || !location || !price) {
    return { error: "All fields are required." };
  }

  if (!flyer || flyer.size === 0) {
    return { error: "A flyer image is required." };
  }

  const validSessions = sessionLabels
    .map((label, i) => ({
      label: label.trim(),
      time: (sessionTimes[i] || "").trim(),
    }))
    .filter((s) => s.label && s.time);

  if (validSessions.length === 0) {
    return { error: "At least one session (label + time) is required." };
  }

  const ext = path.extname(flyer.name) || ".webp";
  const slug = slugify(title);
  const filename = `${slug}-${Date.now()}${ext}`;

  const uploadsDir = path.join(process.cwd(), "public", "assets", "uploads");
  await mkdir(uploadsDir, { recursive: true });

  const bytes = new Uint8Array(await flyer.arrayBuffer());
  await writeFile(path.join(uploadsDir, filename), bytes);

  const flyerPath = `/assets/uploads/${filename}`;

  const maxOrder = await prisma.event.aggregate({ _max: { sortOrder: true } });
  const nextOrder = (maxOrder._max.sortOrder ?? -1) + 1;

  await prisma.event.create({
    data: {
      slug,
      flyer: flyerPath,
      tag,
      badge,
      title,
      date,
      location,
      sessions: JSON.stringify(validSessions),
      price,
      sortOrder: nextOrder,
    },
  });

  revalidatePath("/events");
  redirect("/events");
}

export async function deleteEvent(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/admin");

  const id = formData.get("id") as string;
  if (!id) return;

  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) return;

  if (event.flyer.startsWith("/assets/uploads/")) {
    const filePath = path.join(process.cwd(), "public", event.flyer);
    try {
      await unlink(filePath);
    } catch {
      // file may already be gone
    }
  }

  await prisma.event.delete({ where: { id } });

  revalidatePath("/events");
}
