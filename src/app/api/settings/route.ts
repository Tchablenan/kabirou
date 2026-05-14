import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const settings = await prisma.setting.findMany();
    const map: Record<string, string> = {};
    settings.forEach((s) => { map[s.key] = s.value ?? ""; });
    return NextResponse.json(map, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" },
    });
  } catch (error) {
    console.error("GET Settings Error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  console.log("[Settings PUT] session:", session ? "found" : "null");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    console.log("[Settings PUT] body:", body);
    const { key, value } = body;
    if (!key) return NextResponse.json({ error: "Key is required" }, { status: 400 });

    const setting = await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
    console.log("[Settings PUT] saved:", setting);
    return NextResponse.json(setting);
  } catch (error: any) {
    console.error("[Settings PUT] Error:", error?.message ?? error);
    return NextResponse.json({ error: error?.message ?? "Failed to update setting" }, { status: 500 });
  }
}
