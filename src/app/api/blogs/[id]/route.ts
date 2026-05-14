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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const blog = await prisma.blogPost.findUnique({ where: { id } });
    if (!blog) return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    return NextResponse.json(blog);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const data = await request.json();
    const slug = data.slug ? generateSlug(data.slug) : undefined;

    const blog = await prisma.blogPost.update({
      where: { id },
      data: {
        titleEn: data.titleEn,
        titleFr: data.titleFr,
        ...(slug && { slug }),
        excerptFr: data.excerptFr ?? null,
        excerptEn: data.excerptEn ?? null,
        contentEn: data.contentEn ?? null,
        contentFr: data.contentFr ?? null,
        imageUrl: data.imageUrl ?? null,
        author: data.author,
        published: data.published !== undefined ? data.published : undefined,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : undefined,
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
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    await prisma.blogPost.delete({ where: { id } });
    return NextResponse.json({ message: "Blog post deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 });
  }
}
