"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface BlogPost {
  id: string;
  titleFr: string;
  titleEn: string;
  slug: string;
  excerptFr?: string | null;
  excerptEn?: string | null;
  imageUrl?: string | null;
  author?: string | null;
  publishedAt?: string | null;
  categories?: string[];
  tags?: string[];
}

const ITEMS_PER_PAGE = 6;

function formatDate(val: string | null | undefined, locale: string): string {
  if (!val) return "";
  const d = new Date(val);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function readingTimeFromExcerpt(excerpt: string | null | undefined): number {
  if (!excerpt) return 1;
  return Math.max(1, Math.ceil(excerpt.split(/\s+/).length / 200));
}

export default function BlogListing({ blogs, locale }: { blogs: BlogPost[]; locale: string }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const allCategories = Array.from(
    new Set(blogs.flatMap((b) => b.categories || []))
  ).filter(Boolean);

  const filtered = blogs.filter((b) => {
    const title = locale === "fr" ? b.titleFr : b.titleEn;
    const excerpt = locale === "fr" ? b.excerptFr : b.excerptEn;
    const matchSearch =
      !search ||
      title.toLowerCase().includes(search.toLowerCase()) ||
      (excerpt || "").toLowerCase().includes(search.toLowerCase());
    const matchCat = !activeCategory || b.categories?.includes(activeCategory);
    return matchSearch && matchCat;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleCategory = (cat: string | null) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  return (
    <section className="blog-and-news-are tmp-section-gap">
      <div className="container">
        {/* Filtres */}
        <div className="row mb--40">
          <div className="col-lg-8 col-md-7">
            <div className="signle-side-bar tmponhover" style={{ padding: "8px 16px", borderRadius: "50px", display: "inline-flex", alignItems: "center", gap: "12px", width: "100%", maxWidth: "400px" }}>
              <i className="fa-solid fa-magnifying-glass" style={{ color: "var(--color-primary)" }} />
              <input
                type="text"
                placeholder={locale === "fr" ? "Rechercher un article..." : "Search articles..."}
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                style={{ background: "transparent", border: "none", outline: "none", color: "var(--color-heading)", width: "100%", fontSize: "0.9rem" }}
              />
            </div>
          </div>
          {allCategories.length > 0 && (
            <div className="col-lg-4 col-md-5 flex items-center justify-end gap-2 flex-wrap mt-3 mt-md-0">
              <button
                onClick={() => handleCategory(null)}
                className="px-3 py-1 rounded-full text-sm transition-colors"
                style={{
                  background: !activeCategory ? "var(--color-primary)" : "var(--color-gray-2)",
                  color: !activeCategory ? "#fff" : "var(--color-heading)",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {locale === "fr" ? "Tous" : "All"}
              </button>
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategory(cat)}
                  className="px-3 py-1 rounded-full text-sm transition-colors"
                  style={{
                    background: activeCategory === cat ? "var(--color-primary)" : "var(--color-gray-2)",
                    color: activeCategory === cat ? "#fff" : "var(--color-heading)",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Grille */}
        <div className="row">
          {paginated.length === 0 && (
            <div className="col-12 text-center py-20">
              <p style={{ color: "var(--color-body)" }}>
                {locale === "fr" ? "Aucun article trouvé." : "No articles found."}
              </p>
            </div>
          )}
          {paginated.map((blog, index) => {
            const title = locale === "fr" ? blog.titleFr : blog.titleEn;
            const excerpt = locale === "fr" ? blog.excerptFr : blog.excerptEn;
            const dateStr = formatDate(blog.publishedAt, locale);
            const minutes = readingTimeFromExcerpt(excerpt);

            return (
              <div key={blog.id} className="col-lg-4 col-md-6">
                <div className={`blog-card tmp-hover-link tmp-scroll-trigger tmp-fade-in animation-order-${(index % 6) + 1}`} style={{ marginBottom: "30px" }}>
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
                        <span className="px-3 py-1 rounded-full text-xs font-semibold"
                          style={{ background: "var(--color-primary)", color: "#fff" }}>
                          {blog.categories[0]}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="blog-content-wrap" style={{ paddingTop: "16px" }}>
                    <div className="flex items-center gap-3 mb--10" style={{ fontSize: "0.78rem", color: "var(--color-body)" }}>
                      {dateStr && <span><i className="fa-regular fa-calendar mr-1" />{dateStr}</span>}
                      <span><i className="fa-regular fa-clock mr-1" />{minutes} min</span>
                    </div>
                    <h3 className="blog-title v2">
                      <Link className="link" href={`/${locale}/blog-details/${blog.slug}`}>{title}</Link>
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
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="tmp-pagination-button mt--50">
            <button
              className="pagination-btn"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              style={{ opacity: currentPage === 1 ? 0.3 : 1, cursor: currentPage === 1 ? "not-allowed" : "pointer", fontSize: "18px" }}
            >
              <i className="fa-solid fa-arrow-left" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`pagination-btn${currentPage === page ? " active" : ""}`}
                onClick={() => goToPage(page)}
                style={{ cursor: "pointer" }}
              >
                {page}
              </button>
            ))}
            <button
              className="pagination-btn"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{ opacity: currentPage === totalPages ? 0.3 : 1, cursor: currentPage === totalPages ? "not-allowed" : "pointer", fontSize: "18px" }}
            >
              <i className="fa-solid fa-arrow-right" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
