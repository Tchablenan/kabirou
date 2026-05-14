"use client";

import { useTranslation } from "react-i18next";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState, useEffect } from "react";

interface BlogPost {
  id: string;
  titleEn: string;
  titleFr: string;
  slug: string;
  excerptFr?: string | null;
  excerptEn?: string | null;
  contentEn: string | null;
  contentFr: string | null;
  imageUrl: string | null;
  author: string | null;
  publishedAt?: string | null;
  tags: string[];
  categories: string[];
}

function readingTime(text: string | null | undefined): number {
  if (!text) return 1;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function formatDate(val: string | null | undefined, locale: string): string {
  if (!val) return "";
  const d = new Date(val);
  if (isNaN(d.getTime())) return val;
  return d.toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogDetails({ blog }: { blog: BlogPost }) {
  const { i18n } = useTranslation();
  const locale = i18n.language || "fr";
  const [copied, setCopied] = useState(false);
  const [related, setRelated] = useState<BlogPost[]>([]);

  const title = locale === "fr" ? blog.titleFr : blog.titleEn;
  const content = locale === "fr" ? blog.contentFr : blog.contentEn;
  const image = blog.imageUrl || "/assets/images/blog/blog-img-4.jpg";
  const minutes = readingTime(content);
  const dateStr = formatDate(blog.publishedAt, locale);

  useEffect(() => {
    fetch("/api/blogs")
      .then((r) => r.json())
      .then((data: BlogPost[]) => {
        if (!Array.isArray(data)) return;
        const others = data.filter(
          (b) =>
            b.id !== blog.id &&
            (b.categories?.some((c) => blog.categories?.includes(c)) ||
              b.tags?.some((t) => blog.tags?.includes(t)))
        );
        setRelated(others.slice(0, 3));
      })
      .catch(() => {});
  }, [blog.id]);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(shareUrl);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="blog-details-area-wrapper tmp-section-gap">
      <div className="container">
        {/* Hero image */}
        <div className="row mb--40">
          <div className="col-lg-12">
            <div style={{ position: "relative", width: "100%", height: "480px", borderRadius: "20px", overflow: "hidden" }}>
              <Image
                alt={title}
                src={image}
                fill
                style={{ objectFit: "cover" }}
                priority
                sizes="100vw"
              />
            </div>
          </div>
        </div>

        <div className="row">
          {/* Contenu principal */}
          <div className="col-lg-8">
            <div className="blog-details-content-wrap">
              {/* Catégories */}
              {blog.categories?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb--20">
                  {blog.categories.map((cat, i) => (
                    <span key={i} className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full"
                      style={{ background: "var(--color-primary)", color: "#fff" }}>
                      {cat}
                    </span>
                  ))}
                </div>
              )}

              <h2 className="title">{title}</h2>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-5 mt--20 mb--30" style={{ color: "var(--color-body)", fontSize: "0.85rem" }}>
                <span className="flex items-center gap-2">
                  <i className="fa-regular fa-user" style={{ color: "var(--color-primary)" }} />
                  {blog.author || "Admin"}
                </span>
                {dateStr && (
                  <span className="flex items-center gap-2">
                    <i className="fa-regular fa-calendar" style={{ color: "var(--color-primary)" }} />
                    {dateStr}
                  </span>
                )}
                <span className="flex items-center gap-2">
                  <i className="fa-regular fa-clock" style={{ color: "var(--color-primary)" }} />
                  {minutes} min {locale === "fr" ? "de lecture" : "read"}
                </span>
              </div>

              {/* Contenu Markdown */}
              <div className="blog-markdown-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content || ""}
                </ReactMarkdown>
              </div>

              {/* Tags */}
              {blog.tags?.length > 0 && (
                <div className="tag-details-wrap mt--50">
                  <h3 className="mini-title mb--20">{locale === "fr" ? "Tags" : "Tags"}</h3>
                  <div className="flex flex-wrap gap-3">
                    {blog.tags.map((tag, i) => (
                      <span key={i} className="px-4 py-2 rounded-lg border border-border hover:border-primary transition-colors cursor-default"
                        style={{ background: "var(--color-gray-2)", fontSize: "0.85rem" }}>
                        # {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Partage social */}
              <div className="mt--50 pt--30" style={{ borderTop: "1px solid var(--color-border)" }}>
                <h3 className="mini-title mb--20">{locale === "fr" ? "Partager cet article" : "Share this article"}</h3>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
                    style={{ background: "#0077B5", color: "#fff", fontSize: "0.85rem" }}
                  >
                    <i className="fa-brands fa-linkedin-in" /> LinkedIn
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
                    style={{ background: "#1DA1F2", color: "#fff", fontSize: "0.85rem" }}
                  >
                    <i className="fa-brands fa-twitter" /> Twitter
                  </a>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border transition-colors"
                    style={{ background: "var(--color-gray-2)", color: "var(--color-heading)", fontSize: "0.85rem", cursor: "pointer" }}
                  >
                    <i className={copied ? "fa-solid fa-check" : "fa-solid fa-link"} />
                    {copied ? (locale === "fr" ? "Copié !" : "Copied!") : (locale === "fr" ? "Copier le lien" : "Copy link")}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            <div style={{ position: "sticky", top: "100px" }}>
              <div className="signle-side-bar blog-details-sidebar tmponhover mb--30">
                <div className="header">
                  <h3 className="title">{locale === "fr" ? "À propos de l'article" : "About this article"}</h3>
                </div>
                <div className="body" style={{ padding: "24px" }}>
                  {blog.categories?.length > 0 && (
                    <div className="mb--20">
                      <span className="font-bold block text-xs uppercase mb-1" style={{ color: "var(--color-body)", letterSpacing: "0.05em" }}>
                        {locale === "fr" ? "Catégories" : "Categories"}
                      </span>
                      <span style={{ color: "var(--color-heading)" }}>{blog.categories.join(", ")}</span>
                    </div>
                  )}
                  {dateStr && (
                    <div className="mb--20">
                      <span className="font-bold block text-xs uppercase mb-1" style={{ color: "var(--color-body)", letterSpacing: "0.05em" }}>
                        {locale === "fr" ? "Date de publication" : "Published"}
                      </span>
                      <span style={{ color: "var(--color-heading)" }}>{dateStr}</span>
                    </div>
                  )}
                  <div className="mb--30">
                    <span className="font-bold block text-xs uppercase mb-1" style={{ color: "var(--color-body)", letterSpacing: "0.05em" }}>
                      {locale === "fr" ? "Temps de lecture" : "Reading time"}
                    </span>
                    <span style={{ color: "var(--color-heading)" }}>{minutes} min</span>
                  </div>
                  <Link
                    href={`/${locale}#blog`}
                    className="tmp-btn w-full text-center block"
                    style={{ borderRadius: "8px", background: "var(--color-primary)", color: "#fff", padding: "12px" }}
                  >
                    {locale === "fr" ? "← Retour au blog" : "← Back to Blog"}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Articles similaires */}
        {related.length > 0 && (
          <div className="row mt--80">
            <div className="col-12 mb--40">
              <h3 className="title" style={{ fontSize: "1.8rem" }}>
                {locale === "fr" ? "Articles similaires" : "Related articles"}
              </h3>
            </div>
            {related.map((item) => {
              const rTitle = locale === "fr" ? item.titleFr : item.titleEn;
              const rExcerpt = locale === "fr" ? item.excerptFr : item.excerptEn;
              return (
                <div key={item.id} className="col-lg-4 col-md-6">
                  <div className="blog-card tmp-hover-link" style={{ marginBottom: "30px" }}>
                    <div className="img-box" style={{ borderRadius: "12px", overflow: "hidden", position: "relative", height: "220px" }}>
                      <Link href={`/${locale}/blog-details/${item.slug}`} style={{ display: "block", height: "100%" }}>
                        <Image
                          alt={rTitle}
                          src={item.imageUrl || "/assets/images/blog/blog-img-4.jpg"}
                          fill
                          style={{ objectFit: "cover" }}
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </Link>
                    </div>
                    <div className="blog-content-wrap" style={{ paddingTop: "16px" }}>
                      <h3 className="blog-title v2">
                        <Link className="link" href={`/${locale}/blog-details/${item.slug}`}>{rTitle}</Link>
                      </h3>
                      {rExcerpt && (
                        <p style={{ fontSize: "0.85rem", color: "var(--color-body)", marginBottom: "12px", lineHeight: "1.6" }}>
                          {rExcerpt}
                        </p>
                      )}
                      <Link href={`/${locale}/blog-details/${item.slug}`} className="read-more-btn v2">
                        {locale === "fr" ? "Lire la suite" : "Read More"}{" "}
                        <span className="read-more-icon"><i className="fa-solid fa-angle-right" /></span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
