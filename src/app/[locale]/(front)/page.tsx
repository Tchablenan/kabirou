import dynamic from "next/dynamic";
import Header3 from "@/components/headers/Header3";
import Header5 from "@/components/headers/Header5";
import Hero from "@/components/homes/home-7/Hero";
import Services6 from "@/components/common/Services6";
import Footer1 from "@/components/footers/Footer1";
import Copyright from "@/components/footers/Copyright";
import prisma from "@/lib/prisma";

// Sections below the fold are lazy-loaded: no JS downloaded until needed
const About = dynamic(() => import("@/components/common/About"), { ssr: true });
const Skills = dynamic(() => import("@/components/common/Skills"), { ssr: true });
const Education2 = dynamic(() => import("@/components/common/Education2"), { ssr: true });
const Portfolio2 = dynamic(() => import("@/components/common/Portfolio2"), { ssr: true });
const Blogs3 = dynamic(() => import("@/components/common/Blogs3"), { ssr: true });
const Contact2 = dynamic(() => import("@/components/common/Contact2"), { ssr: true });

export default async function HomePage7() {
  // Single round-trip: all data fetched in parallel server-side
  const [skills, experiences, projects, blogs, settings] = await Promise.allSettled([
    prisma.skill.findMany({ orderBy: { displayOrder: "asc" } }),
    prisma.experience.findMany({ orderBy: { displayOrder: "asc" } }),
    prisma.project.findMany({ orderBy: { displayOrder: "asc" } }),
    prisma.blogPost.findMany({
      where: { published: true },
      orderBy: [{ displayOrder: "asc" }, { publishedAt: "desc" }],
    }),
    prisma.setting.findMany(),
  ]).catch(() => []);

  // En cas d'échec d'une requête (ex. coupure passagère de la base), on passe `undefined` :
  // la section recharge alors ses données côté navigateur au lieu d'afficher une liste vide.
  for (const [name, result] of Object.entries({ skills, experiences, projects, blogs, settings })) {
    if (result?.status === "rejected") console.error(`Home page: ${name} query failed`, result.reason);
  }

  const safeSkills     = skills?.status === "fulfilled"     ? skills.value      : undefined;
  const safeExperiences = experiences?.status === "fulfilled" ? experiences.value : undefined;
  const safeProjects   = projects?.status === "fulfilled"   ? projects.value    : undefined;
  const safeBlogs      = blogs?.status === "fulfilled"      ? blogs.value.map(b => ({
    ...b,
    publishedAt: b.publishedAt?.toISOString() ?? null,
    createdAt: b.createdAt.toISOString(),
    updatedAt: b.updatedAt.toISOString(),
  })) : undefined;
  const settingsMap    = settings?.status === "fulfilled"
    ? Object.fromEntries(settings.value.map((s: any) => [s.key, s.value ?? ""]))
    : {};

  return (
    <div className="page-with-left-header">
      <Header3 />
      <Header5 />
      <div className="dashboard-style-header index-seven">
        <Hero
          initialCvUrl={settingsMap["cv_url"] ?? ""}
          projectsCount={Number(settingsMap["stats_projects"]) || undefined}
        />
        <About cvUrl={settingsMap["cv_url"] ?? ""} />
        <Services6 />
        <Portfolio2 initialProjects={safeProjects} />
        <Education2
          initialExperiences={safeExperiences}
          initialStats={{
            years: Number(settingsMap["stats_years"]) || undefined,
            projects: Number(settingsMap["stats_projects"]) || undefined,
            countries: Number(settingsMap["stats_countries"]) || undefined,
          }}
        />
        <Skills initialSkills={safeSkills} />
        <Blogs3 initialBlogs={safeBlogs as any} />
        <Contact2 />
        <Footer1 />
        <Copyright />
      </div>
    </div>
  );
}
