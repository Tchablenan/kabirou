import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const blog = await prisma.blogPost.findUnique({
      where: { slug },
    });
    if (!blog) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }
    return NextResponse.json(blog);
  } catch (error) {
    console.error("GET Blog Slug Error:", error);
    return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 });
  }
}
