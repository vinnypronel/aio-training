"use server";

import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteMessage(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/admin");

  const id = formData.get("id") as string;
  if (!id) return;

  await prisma.contactMessage.delete({ where: { id } }).catch(() => {});
  revalidatePath("/admin/messages");
}
