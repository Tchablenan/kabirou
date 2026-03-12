import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST() {
  try {
    const stats = await (prisma as any).siteStats.upsert({
      where: { id: "global" },
      update: { visits: { increment: 1 } },
      create: { id: "global", visits: 1 },
    });

    return NextResponse.json({ visits: stats.visits });
  } catch (error: any) {
    console.error("Increment visits error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
