import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const project = await prisma.project.findUnique({
      where: { id },
    });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
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

  const { id } = await params;
  try {
    const data = await request.json();
    const project = await prisma.project.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        summaryFr: data.summaryFr,
        summaryEn: data.summaryEn,
        descriptionFr: data.descriptionFr,
        descriptionEn: data.descriptionEn,
        imageUrl: data.imageUrl,
        link: data.link,
        categories: data.categories || [],
        features: data.features || [],
        tags: data.tags || [],
        impactTitleFr: data.impactTitleFr,
        impactTitleEn: data.impactTitleEn,
        impactContentFr: data.impactContentFr,
        impactContentEn: data.impactContentEn,
        projectDate: data.projectDate,
        myRoleFr: data.myRoleFr,
        myRoleEn: data.myRoleEn,
        displayOrder: data.displayOrder || 0,
      },
    });
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
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

  const { id } = await params;
  try {
    await prisma.project.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
