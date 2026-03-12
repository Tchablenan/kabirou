import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: { displayOrder: "asc" },
    });
    return NextResponse.json(experiences);
  } catch (error) {
    console.error("GET Experiences Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    const experience = await prisma.experience.create({
      data: {
        titleFr: data.titleFr,
        titleEn: data.titleEn,
        organization: data.organization,
        duration: data.duration,
        type: data.type || "WORK",
        descriptionFr: data.descriptionFr,
        descriptionEn: data.descriptionEn,
        displayOrder: data.displayOrder || 0,
      },
    });
    return NextResponse.json(experience);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create experience" }, { status: 500 });
  }
}
