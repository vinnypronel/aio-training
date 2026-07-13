import { config } from "dotenv";
config({ path: [".env.local", ".env"] });

import { PrismaClient } from "../lib/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required to seed.");
}
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.event.upsert({
    where: { slug: "football-skills-clinic" },
    update: {
      location: "Heavenly Farms Park, East Brunswick, NJ",
    },
    create: {
      slug: "football-skills-clinic",
      flyer: "/assets/images/clinic_flyer.png",
      tag: "Open — Limited Spots",
      badge: "2-Day Summer Clinic",
      title: "AIO Football Skills Clinic",
      date: "July 25-26, 2026",
      location: "Heavenly Farms Park, East Brunswick, NJ",
      sessions: JSON.stringify([
        { label: "Younger athletes — Ages 8-12", time: "6:00 PM - 8:00 PM" },
        { label: "Teen athletes — Ages 13-18", time: "6:00 PM - 8:00 PM" },
      ]),
      price: "$100 early through July 18, 2026, then $150",
      sortOrder: 0,
    },
  });
  console.log("Seeded/updated football skills clinic event");
}

main().finally(() => prisma.$disconnect());
