import { PrismaClient } from "../lib/generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "node:path";

const dbPath = path.resolve(import.meta.dirname, "..", "dev.db").replace(/\\/g, "/");
const adapter = new PrismaBetterSqlite3({ url: "file:" + dbPath });
const prisma = new PrismaClient({ adapter });

async function main() {
  const existing = await prisma.event.findFirst();
  if (existing) {
    console.log("Already seeded");
    return;
  }
  await prisma.event.create({
    data: {
      slug: "football-skills-clinic",
      flyer: "/assets/images/football-skills-clinic-flyer.webp",
      tag: "Open — Limited Spots",
      badge: "2-Day Summer Clinic",
      title: "AIO Football Skills Clinic",
      date: "July 25-26, 2026",
      location: "Heavenly Farms Park",
      sessions: JSON.stringify([
        { label: "Younger athletes — Ages 8-12", time: "6:00 PM - 8:00 PM" },
        { label: "Teen athletes — Ages 13-18", time: "6:00 PM - 8:00 PM" },
      ]),
      price: "$125 early through July 15, 2026, then $150",
      sortOrder: 0,
    },
  });
  console.log("Seeded football skills clinic event");
}

main().finally(() => prisma.$disconnect());
