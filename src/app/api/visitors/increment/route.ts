import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { clientIp, rateLimitHit } from "@/lib/rate-limit";

// Une visite comptée par adresse IP toutes les 6 heures : le compteur ne peut pas être gonflé à la main
export async function POST(req: Request) {
  try {
    const limit = await rateLimitHit(`visit:${clientIp(req.headers)}`, 1, 6 * 60 * 60);

    const stats = limit.ok
      ? await prisma.siteStats.upsert({
          where: { id: "global" },
          update: { visits: { increment: 1 } },
          create: { id: "global", visits: 1 },
        })
      : await prisma.siteStats.findUnique({ where: { id: "global" } });

    return NextResponse.json({ visits: stats?.visits ?? 0, counted: limit.ok });
  } catch (error) {
    console.error("Increment visits error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
