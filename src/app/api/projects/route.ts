import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { displayOrder: "asc" },
    });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    const project = await prisma.project.create({
      data: {
        title: data.title,
        slug: data.slug || data.title.toLowerCase().replace(/ /g, "-"),
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
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
