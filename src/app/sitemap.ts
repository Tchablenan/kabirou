import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://djantchiemo-kabirou.vercel.app";
  const locales = ["en", "fr"];

  // Static routes
  const staticRoutes = ["", "/service", "/experience", "/competence", "/portfolio", "/blog", "/contact"];

  const routes = locales.flatMap((locale) =>
    staticRoutes.map((route) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.8,
    }))
  );

  // Dynamic Project Routes
  const projects = await prisma.project.findMany({ select: { slug: true, updatedAt: true } });
  const projectRoutes = locales.flatMap((locale) =>
    projects.map((project) => ({
      url: `${baseUrl}/${locale}/project-details/${project.slug}`,
      lastModified: project.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
  );

  // Dynamic Blog Routes
  const blogs = await prisma.blogPost.findMany({ select: { slug: true, updatedAt: true } });
  const blogRoutes = locales.flatMap((locale) =>
    blogs.map((blog) => ({
      url: `${baseUrl}/${locale}/blog-details/${blog.slug}`,
      lastModified: blog.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }))
  );

  return [...routes, ...projectRoutes, ...blogRoutes];
}
