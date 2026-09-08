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
      tag: "Past Event",
      badge: "2-Day Group Session",
      title: "AIO Football Skills Group Session",
      date: "July 25-26, 2026",
      location: "Heavenly Farms Park, East Brunswick, NJ",
      sessions: JSON.stringify([
        { label: "Younger athletes — Ages 8-12", time: "6:00 PM - 8:00 PM" },
        { label: "Teen athletes — Ages 13-18", time: "6:00 PM - 8:00 PM" },
      ]),
      price: "$20 per day - $40 both days per athlete",
      sortOrder: 1,
    },
    create: {
      slug: "football-skills-clinic",
      flyer: "/assets/images/group_session_flyer.png",
      tag: "Past Event",
      badge: "2-Day Group Session",
      title: "AIO Football Skills Group Session",
      date: "July 25-26, 2026",
      location: "Heavenly Farms Park, East Brunswick, NJ",
      sessions: JSON.stringify([
        { label: "Younger athletes — Ages 8-12", time: "6:00 PM - 8:00 PM" },
        { label: "Teen athletes — Ages 13-18", time: "6:00 PM - 8:00 PM" },
      ]),
      price: "$20 per day - $40 both days per athlete",
      sortOrder: 1,
    },
  });
  console.log("Seeded/updated football skills group session event (archived/past)");

  await prisma.event.upsert({
    where: { slug: "grand-opening-combine" },
    update: {
      flyer: "/assets/images/grand-opening-combine-event-flyer.webp",
      tag: "Past Event",
      badge: "Football Combine",
      title: "AIO Grand Opening Combine Event",
      date: "Sunday, May 31, 2026",
      location: "Heavenly Farms Park, 440 Dunhams Corner Rd, East Brunswick, NJ 08816",
      sessions: JSON.stringify([
        { label: "Ages 8-12", time: "1:00 PM - 2:30 PM" },
        { label: "Ages 13-18", time: "3:00 PM - 4:30 PM" },
      ]),
      price: "$20 to sign up",
      sortOrder: 2,
    },
    create: {
      slug: "grand-opening-combine",
      flyer: "/assets/images/grand-opening-combine-event-flyer.webp",
      tag: "Past Event",
      badge: "Football Combine",
      title: "AIO Grand Opening Combine Event",
      date: "Sunday, May 31, 2026",
      location: "Heavenly Farms Park, 440 Dunhams Corner Rd, East Brunswick, NJ 08816",
      sessions: JSON.stringify([
        { label: "Ages 8-12", time: "1:00 PM - 2:30 PM" },
        { label: "Ages 13-18", time: "3:00 PM - 4:30 PM" },
      ]),
      price: "$20 to sign up",
      sortOrder: 2,
    },
  });
  console.log("Seeded/updated grand opening combine event (archived/past)");
}

main().finally(() => prisma.$disconnect());
