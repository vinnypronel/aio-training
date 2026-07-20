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
      flyer: "/assets/images/group_session_flyer.png",
      badge: "2-Day Group Session",
      title: "AIO Football Skills Group Session",
      location: "Heavenly Farms Park, East Brunswick, NJ",
      price: "$20 per day - $40 both days per athlete",
    },
    create: {
      slug: "football-skills-clinic",
      flyer: "/assets/images/group_session_flyer.png",
      tag: "Open — Limited Spots",
      badge: "2-Day Group Session",
      title: "AIO Football Skills Group Session",
      date: "July 25-26, 2026",
      location: "Heavenly Farms Park, East Brunswick, NJ",
      sessions: JSON.stringify([
        { label: "Younger athletes — Ages 8-12", time: "6:00 PM - 8:00 PM" },
        { label: "Teen athletes — Ages 13-18", time: "6:00 PM - 8:00 PM" },
      ]),
      price: "$20 per day - $40 both days per athlete",
      sortOrder: 0,
    },
  });
  console.log("Seeded/updated football skills group session event");
}

main().finally(() => prisma.$disconnect());
