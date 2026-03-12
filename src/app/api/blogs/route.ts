import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const blogs = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(blogs);
  } catch (error) {
    console.error("GET Blogs Error:", error);
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
    
    // Simple slug generation if not provided
    const slug = data.slug || data.titleEn.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    const blog = await prisma.blogPost.create({
      data: {
        titleEn: data.titleEn,
        titleFr: data.titleFr,
        slug: slug,
        contentEn: data.contentEn,
        contentFr: data.contentFr,
        imageUrl: data.imageUrl,
        author: data.author || "Admin",
        date: data.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
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
