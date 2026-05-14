import type { Metadata } from "next";
import BlogListing from "@/components/blog/BlogListing";
import Header3 from "@/components/headers/Header3";
import Header5 from "@/components/headers/Header5";
import Footer1 from "@/components/footers/Footer1";
import Copyright from "@/components/footers/Copyright";
import Link from "next/link";
import prisma from "@/lib/prisma";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "fr" ? "Blog — Articles & Réflexions" : "Blog — Articles & Insights",
    description:
      locale === "fr"
        ? "Découvrez mes articles sur le développement web, mobile et les dernières tendances tech."
        : "Explore my articles on web development, mobile and the latest tech trends.",
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  let blogs: any[] = [];
  try {
    const raw = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: [{ displayOrder: "asc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
    });
    blogs = raw.map((b) => ({
      ...b,
      publishedAt: b.publishedAt?.toISOString() ?? null,
      createdAt: b.createdAt.toISOString(),
      updatedAt: b.updatedAt.toISOString(),
    }));
  } catch {}

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
                  <h1 className="title split-collab">Blog</h1>
                  <ul className="page-list">
                    <li className="tmp-breadcrumb-item">
                      <Link href={`/${locale}`}>{locale === "fr" ? "Accueil" : "Home"}</Link>
                    </li>
                    <li className="icon"><i className="fa-solid fa-angle-right" /></li>
                    <li className="tmp-breadcrumb-item active">Blog</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <BlogListing blogs={blogs} locale={locale} />
        <Footer1 />
        <Copyright />
      </div>
    </>
  );
}
