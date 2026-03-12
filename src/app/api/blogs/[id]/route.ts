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
    const blog = await prisma.blogPost.findUnique({
      where: { id },
    });
    if (!blog) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }
    return NextResponse.json(blog);
  } catch (error) {
    console.error("GET Blog ID Error:", error);
    return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 });
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

    // Generate slug if titleEn is updated and slug is not provided
    const slug = data.slug || (data.titleEn ? data.titleEn.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') : undefined);

    const blog = await prisma.blogPost.update({
      where: { id },
      data: {
        titleEn: data.titleEn,
        titleFr: data.titleFr,
        slug: slug,
        contentEn: data.contentEn,
        contentFr: data.contentFr,
        imageUrl: data.imageUrl,
        author: data.author,
        date: data.date,
        tags: data.tags,
        categories: data.categories,
        displayOrder: data.displayOrder,
      },
    });
    return NextResponse.json(blog);
  } catch (error) {
    console.error("PUT Blog ID Error:", error);
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 });
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
    await prisma.blogPost.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Blog post deleted" });
  } catch (error) {
    console.error("DELETE Blog ID Error:", error);
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 });
  }
}
