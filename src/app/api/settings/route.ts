import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Seuls ces réglages sont visibles par les visiteurs ; l'admin connecté les voit tous
const isPublicKey = (key: string) => key === "cv_url" || key.startsWith("stats_");
const KEY_FORMAT = /^[a-z0-9_]{1,64}$/;

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const settings = await prisma.setting.findMany();
    const map: Record<string, string> = {};
    for (const s of settings) {
      if (session || isPublicKey(s.key)) map[s.key] = s.value ?? "";
    }
    return NextResponse.json(map, {
      headers: {
        "Cache-Control": session ? "private, no-store" : "public, s-maxage=300, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    console.error("GET Settings Error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json().catch(() => null);
    const key = typeof body?.key === "string" ? body.key : "";
    const value = body?.value == null ? null : String(body.value).slice(0, 2000);
    if (!KEY_FORMAT.test(key)) {
      return NextResponse.json({ error: "Invalid key" }, { status: 400 });
    }

    const setting = await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
    return NextResponse.json(setting);
  } catch (error) {
    console.error("[Settings PUT] Error:", error);
    return NextResponse.json({ error: "Failed to update setting" }, { status: 500 });
  }
}
