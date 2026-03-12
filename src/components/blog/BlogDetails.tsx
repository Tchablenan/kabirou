"use client";

import { useTranslation } from "react-i18next";
import Link from "next/link";

interface BlogPost {
  id: string;
  titleEn: string;
  titleFr: string;
  slug: string;
  contentEn: string | null;
  contentFr: string | null;
  imageUrl: string | null;
  author: string | null;
  date: string | null;
  tags: string[];
  categories: string[];
}

interface BlogDetailsProps {
  blog: BlogPost;
}

export default function BlogDetails({ blog }: BlogDetailsProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language || "fr";

  const title = locale === "fr" ? blog.titleFr : blog.titleEn;
  const content = locale === "fr" ? blog.contentFr : blog.contentEn;
  const image = blog.imageUrl || "/assets/images/blog/blog-img-4.jpg";

  return (
    <div className="blog-details-area-wrapper tmp-section-gap">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="blog-details-thumnail-wrap">
              <img
                loading="lazy"
                alt={title}
                src={image}
                width={1290}
                height={560}
                className="object-cover rounded-2xl"
              />
            </div>
          </div>
          <div className="col-lg-8">
            <div className="blog-details-content-wrap">
              <h2 className="title">{title}</h2>
              <div className="blog-meta mt--20 mb--30 flex gap-5 text-muted-foreground text-sm font-medium uppercase tracking-wider">
                <div className="flex items-center gap-2">
                   <i className="fa-regular fa-user text-primary" /> {blog.author || "Admin"}
                </div>
                <div className="flex items-center gap-2">
                   <i className="fa-regular fa-calendar text-primary" /> {blog.date}
                </div>
              </div>
              <div className="docs whitespace-pre-wrap leading-relaxed text-lg">
                {content}
              </div>

              {blog.tags && blog.tags.length > 0 && (
                <div className="tag-details-wrap mt--50">
                   <h3 className="mini-title mb--20">{locale === "fr" ? "Tags de l'article" : "Article Tags"}</h3>
                   <div className="flex flex-wrap gap-3">
                      {blog.tags.map((tag, i) => (
                        <span key={i} className="px-4 py-2 bg-muted text-foreground rounded-lg border border-border hover:border-primary transition-colors cursor-default">
                          {tag}
                        </span>
                      ))}
                   </div>
                </div>
              )}
            </div>
          </div>
          <div className="col-lg-4">
            <div className="signle-side-bar blog-details-sidebar tmponhover">
              <div className="header">
                <h3 className="title">{locale === "fr" ? "À propos de l'article" : "About Article"}</h3>
              </div>
              <div className="body p-6">
                <div className="project-details-info mb-4">
                  <span className="font-bold block text-sm uppercase text-muted-foreground mb-1">{locale === "fr" ? "Catégories" : "Categories"}</span>
                  <div className="flex flex-wrap gap-1">
                    {blog.categories?.join(", ") || "Article"}
                  </div>
                </div>
                <div className="project-details-info mb-4">
                  <span className="font-bold block text-sm uppercase text-muted-foreground mb-1">{locale === "fr" ? "Date de publication" : "Published Date"}</span>
                  {blog.date}
                </div>
                
                <div className="mt-8">
                  <Link href={`/${locale}#blog`} className="tmp-btn w-full text-center block py-3 rounded-lg bg-primary text-white hover:opacity-90 transition-opacity">
                    {locale === "fr" ? "Retour au blog" : "Back to Blog"}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
