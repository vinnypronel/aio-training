import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(__dirname, "../.env.local") });

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const events = await prisma.event.findMany({ select: { id: true, title: true, location: true } });
  console.log(JSON.stringify(events, null, 2));

  // Update any event that doesn't already have East Brunswick in the location
  const result = await prisma.event.updateMany({
    where: {
      location: { not: { contains: "East Brunswick" } }
    },
    data: { location: "Heavenly Farms Park, East Brunswick, NJ" },
  });
  console.log(`Updated ${result.count} event(s).`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
