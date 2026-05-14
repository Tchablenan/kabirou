import type { Metadata } from "next";
import BlogDetails from "@/components/blog/BlogDetails";
import Link from "next/link";
import Header3 from "@/components/headers/Header3";
import Header5 from "@/components/headers/Header5";
import Footer1 from "@/components/footers/Footer1";
import Copyright from "@/components/footers/Copyright";
import prisma from "@/lib/prisma";

async function getBlog(slug: string) {
  try {
    return await prisma.blogPost.findUnique({ where: { slug } });
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const blog = await getBlog(slug);
  if (!blog) return { title: "Article introuvable" };

  const title = locale === "fr" ? blog.titleFr : blog.titleEn;
  const description = locale === "fr"
    ? blog.excerptFr || blog.contentFr?.slice(0, 160)
    : blog.excerptEn || blog.contentEn?.slice(0, 160);

  return {
    title,
    description: description || undefined,
    openGraph: {
      title,
      description: description || undefined,
      type: "article",
      ...(blog.imageUrl && { images: [{ url: blog.imageUrl }] }),
      ...(blog.publishedAt && { publishedTime: blog.publishedAt.toISOString() }),
      authors: [blog.author || "Kabirou Djantchiemo"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: description || undefined,
      ...(blog.imageUrl && { images: [blog.imageUrl] }),
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold mb-4">
          {locale === "fr" ? "Article introuvable" : "Article not found"}
        </h1>
        <Link href={`/${locale}`} className="tmp-btn">
          {locale === "fr" ? "Retour à l'accueil" : "Back to home"}
        </Link>
      </div>
    );
  }

  const serialized = {
    ...blog,
    publishedAt: blog.publishedAt?.toISOString() ?? null,
    createdAt: blog.createdAt.toISOString(),
    updatedAt: blog.updatedAt.toISOString(),
  };

  const breadcrumbTitle = locale === "fr" ? blog.titleFr : blog.titleEn;

  return (
    <>
      <Header3 />
      <Header5 />
      <div className="page-with-left-header dashboard-style-header index-seven">
        <div className="breadcrumb-area breadcrumb-bg">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="breadcrumb-inner text-center">
                  <h1 className="title split-collab">{breadcrumbTitle}</h1>
                  <ul className="page-list">
                    <li className="tmp-breadcrumb-item">
                      <Link href={`/${locale}`}>{locale === "fr" ? "Accueil" : "Home"}</Link>
                    </li>
                    <li className="icon"><i className="fa-solid fa-angle-right" /></li>
                    <li className="tmp-breadcrumb-item">
                      <Link href={`/${locale}/blog`}>Blog</Link>
                    </li>
                    <li className="icon"><i className="fa-solid fa-angle-right" /></li>
                    <li className="tmp-breadcrumb-item active">Article</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <BlogDetails blog={serialized as any} />
        <Footer1 />
        <Copyright />
      </div>
    </>
  );
}
