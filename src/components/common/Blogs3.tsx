"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import Image from "next/image";

interface BlogPost {
  id: string;
  titleEn: string;
  titleFr: string;
  slug: string;
  excerptFr?: string | null;
  excerptEn?: string | null;
  imageUrl: string | null;
  author: string | null;
  publishedAt?: string | null;
  categories?: string[];
}

function formatDate(val: string | null | undefined, locale: string): string {
  if (!val) return "";
  const d = new Date(val);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function Blogs3({
  parentClass = "blog-and-news-are tmp-section-gap",
  isLight = false,
  initialBlogs,
}: {
  parentClass?: string;
  isLight?: boolean;
  initialBlogs?: BlogPost[];
}) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language || "fr";
  const [blogs, setBlogs] = useState<BlogPost[]>(initialBlogs ? initialBlogs.slice(0, 3) : []);
  const [isLoading, setIsLoading] = useState(!initialBlogs);

  useEffect(() => {
    if (initialBlogs) return;
    fetch("/api/blogs")
      .then((res) => res.json())
      .then((data) => setBlogs(Array.isArray(data) ? data.slice(0, 3) : []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [initialBlogs]);

  return (
    <section className={parentClass} id="blog">
      <div className="container">
        <div className="section-head mb--50">
          <div className="section-sub-title center-title tmp-scroll-trigger tmp-fade-in animation-order-1">
            <span className="subtitle">{t("navigation.blog")}</span>
          </div>
          <h2 className="title split-collab tmp-scroll-trigger tmp-fade-in animation-order-2">
            {t("blog.title")}
          </h2>
        </div>

        <div className="row">
          {isLoading && Array.from({ length: 3 }).map((_, i) => (
            <div key={`skel-${i}`} className="col-lg-4 col-md-6 col-sm-6">
              <div className="blog-card" style={{ marginBottom: "30px" }}>
                <div style={{ width: "100%", height: "240px", background: "rgba(255,255,255,0.07)", borderRadius: "12px", animation: "pulse 1.5s ease-in-out infinite", marginBottom: "16px" }} />
                <div style={{ height: "18px", width: "75%", background: "rgba(255,255,255,0.07)", borderRadius: "6px", marginBottom: "10px", animation: "pulse 1.5s ease-in-out infinite" }} />
                <div style={{ height: "14px", width: "90%", background: "rgba(255,255,255,0.05)", borderRadius: "6px", animation: "pulse 1.5s ease-in-out infinite" }} />
              </div>
            </div>
          ))}

          {!isLoading && blogs.map((blog, index) => {
            const title = locale === "fr" ? blog.titleFr : blog.titleEn;
            const excerpt = locale === "fr" ? blog.excerptFr : blog.excerptEn;
            const dateStr = formatDate(blog.publishedAt, locale);

            return (
              <div key={blog.id} className="col-lg-4 col-md-6 col-sm-6">
                <div className={`blog-card tmp-hover-link tmp-scroll-trigger tmp-fade-in animation-order-${index + 1}`}>
                  <div className="img-box" style={{ position: "relative", height: "240px", borderRadius: "12px", overflow: "hidden" }}>
                    <Link href={`/${locale}/blog-details/${blog.slug}`} style={{ display: "block", height: "100%" }}>
                      <Image
                        alt={title}
                        src={blog.imageUrl || "/assets/images/blog/blog-img-4.jpg"}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </Link>
                    {blog.categories && blog.categories.length > 0 && (
                      <div style={{ position: "absolute", top: "12px", left: "12px" }}>
                        <span style={{ background: "var(--color-primary)", color: "#fff", padding: "3px 10px", borderRadius: "50px", fontSize: "0.75rem", fontWeight: 600 }}>
                          {blog.categories[0]}
                        </span>
                      </div>
                    )}
                    <ul className="blog-tags">
                      <li>
                        <span className="tag-icon"><i className="fa-regular fa-user" /></span>
                        {blog.author || "Admin"}
                      </li>
                      {dateStr && (
                        <li>
                          <span className="tag-icon"><i className="fa-solid fa-calendar-days" /></span>
                          {dateStr}
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="blog-content-wrap">
                    <h3 className="blog-title v2">
                      <Link className="link" href={`/${locale}/blog-details/${blog.slug}`}>
                        {title}
                      </Link>
                    </h3>
                    {excerpt && (
                      <p style={{ fontSize: "0.85rem", color: "var(--color-body)", lineHeight: "1.7", marginBottom: "12px" }}>
                        {excerpt}
                      </p>
                    )}
                    <Link href={`/${locale}/blog-details/${blog.slug}`} className="read-more-btn v2">
                      {locale === "fr" ? "Lire la suite" : "Read More"}{" "}
                      <span className="read-more-icon"><i className="fa-solid fa-angle-right" /></span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          {!isLoading && blogs.length === 0 && (
            <div className="col-12 text-center">
              <p style={{ color: "var(--color-body)" }}>
                {locale === "fr" ? "Aucun article de blog pour le moment." : "No blog posts yet."}
              </p>
            </div>
          )}
        </div>

        {/* Lien vers la page blog complète */}
        {!isLoading && blogs.length > 0 && (
          <div className="text-center mt--50">
            <Link href={`/${locale}/blog`} className="tmp-btn hover-icon-reverse radius-round">
              <span className="icon-reverse-wrapper">
                <span className="btn-text">{locale === "fr" ? "Voir tous les articles" : "View all articles"}</span>
                <span className="btn-icon"><i className="fa-sharp fa-regular fa-arrow-right" /></span>
                <span className="btn-icon"><i className="fa-sharp fa-regular fa-arrow-right" /></span>
              </span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
