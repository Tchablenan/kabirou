import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { displayOrder: "asc" },
    });
    return NextResponse.json(skills);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    const skill = await prisma.skill.create({
      data: {
        name: data.name,
        iconUrl: data.iconUrl,
        category: data.category || "DEVELOPMENT",
        displayOrder: data.displayOrder || 0,
      },
    });
    return NextResponse.json(skill);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create skill" }, { status: 500 });
  }
}
