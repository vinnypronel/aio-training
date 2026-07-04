import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

// Lightweight check so a client component can know whether the current visitor
// is a signed-in admin without making every page server-rendered.
export async function GET() {
  const session = await getSession();
  return NextResponse.json(
    { isAdmin: !!session },
    { headers: { "Cache-Control": "no-store" } },
  );
}
