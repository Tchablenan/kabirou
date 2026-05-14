import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

function generateSlug(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get("all") === "true";
    const session = showAll ? await getServerSession(authOptions) : null;

    const blogs = await prisma.blogPost.findMany({
      where: showAll && session ? {} : { published: true },
      orderBy: [{ displayOrder: "asc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(blogs, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" },
    });
  } catch (error) {
    console.error("GET Blogs Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await request.json();
    const slug = data.slug ? generateSlug(data.slug) : generateSlug(data.titleFr || data.titleEn);

    const blog = await prisma.blogPost.create({
      data: {
        titleEn: data.titleEn,
        titleFr: data.titleFr,
        slug,
        excerptFr: data.excerptFr || null,
        excerptEn: data.excerptEn || null,
        contentEn: data.contentEn || null,
        contentFr: data.contentFr || null,
        imageUrl: data.imageUrl || null,
        author: data.author || "Admin",
        published: data.published !== undefined ? data.published : true,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : new Date(),
        tags: data.tags || [],
        categories: data.categories || [],
        displayOrder: data.displayOrder || 0,
      },
    });
    return NextResponse.json(blog);
  } catch (error) {
    console.error("POST Blog Error:", error);
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 });
  }
}
