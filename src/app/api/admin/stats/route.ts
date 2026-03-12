import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      console.log("Stats API: Unauthorized access attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Individual counts with fail-safes
    const [projectsCount, experiencesCount, skillsCount] = await Promise.all([
      prisma.project.count().catch(() => 0),
      prisma.experience.count().catch(() => 0),
      prisma.skill.count().catch(() => 0),
    ]);
    
    let visitors = 0;
    try {
      // Use dynamic access to avoid compile-time issues if sync is pending
      const stats = await (prisma as any).siteStats.findUnique({ where: { id: "global" } });
      visitors = stats?.visits || 0;
    } catch (e) {
      console.error("SiteStats fetch failed:", e);
    }

    return NextResponse.json({
      projects: projectsCount,
      experiences: experiencesCount,
      skills: skillsCount,
      visitors: visitors,
    });
  } catch (error: any) {
    console.error("Stats fetch error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des statistiques" },
      { status: 500 }
    );
  }
}
