import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const skill = await prisma.skill.findUnique({
      where: { id },
    });
    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }
    return NextResponse.json(skill);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch skill" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const data = await request.json();
    const skill = await prisma.skill.update({
      where: { id },
      data: {
        name: data.name,
        iconUrl: data.iconUrl,
        category: data.category,
        displayOrder: data.displayOrder,
      },
    });
    return NextResponse.json(skill);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update skill" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.skill.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Skill deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete skill" }, { status: 500 });
  }
}
