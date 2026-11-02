import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { companySchema } from "@/lib/companies";

// GET /api/companies         -> entreprises visibles (site public)
// GET /api/companies?all=1   -> toutes, y compris masquées (admin connecté)
export async function GET(request: Request) {
  const wantsAll = new URL(request.url).searchParams.get("all") === "1";

  if (wantsAll) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const companies = await prisma.company.findMany({
      where: wantsAll ? undefined : { visible: true },
      orderBy: { displayOrder: "asc" },
    });
    return NextResponse.json(companies, {
      headers: {
        "Cache-Control": wantsAll
          ? "private, no-store"
          : "public, s-maxage=300, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    console.error("GET /api/companies failed", error);
    return NextResponse.json({ error: "Failed to fetch companies" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = companySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid data" },
      { status: 400 }
    );
  }

  try {
    const company = await prisma.company.create({ data: parsed.data });
    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    console.error("POST /api/companies failed", error);
    return NextResponse.json({ error: "Failed to create company" }, { status: 500 });
  }
}
