import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { companySchema } from "@/lib/companies";

type Params = { params: Promise<{ id: string }> };

const isNotFound = (error: unknown) =>
  typeof error === "object" && error !== null && (error as { code?: string }).code === "P2025";

export async function PUT(request: Request, { params }: Params) {
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
    const { id } = await params;
    const company = await prisma.company.update({ where: { id }, data: parsed.data });
    return NextResponse.json(company);
  } catch (error) {
    if (isNotFound(error)) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }
    console.error("PUT /api/companies/[id] failed", error);
    return NextResponse.json({ error: "Failed to update company" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    await prisma.company.delete({ where: { id } });
    return NextResponse.json({ message: "Company deleted" });
  } catch (error) {
    if (isNotFound(error)) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }
    console.error("DELETE /api/companies/[id] failed", error);
    return NextResponse.json({ error: "Failed to delete company" }, { status: 500 });
  }
}
