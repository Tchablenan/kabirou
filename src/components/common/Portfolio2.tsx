"use client";

import { useTranslation } from "react-i18next";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

interface Project {
  id: string;
  title: string;
  slug: string;
  summaryFr: string | null;
  summaryEn: string | null;
  descriptionFr: string | null;
  descriptionEn: string | null;
  imageUrl: string | null;
  link: string | null;
  categories: string[];
  tags: string[];
  displayOrder: number;
}

const ITEMS_PER_PAGE = 4;
const MAX_BADGES = 5;

export default function Portfolio({ isLight = false, initialProjects }: { isLight?: boolean; initialProjects?: Project[] }) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language || "fr";
  const [projects, setProjects] = useState<Project[]>(initialProjects ?? []);
  const [isLoading, setIsLoading] = useState(!initialProjects);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    if (initialProjects) return;
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [initialProjects]);

  const allCategories = Array.from(
    new Set(projects.flatMap((p) => p.categories || []))
  ).filter(Boolean);

  const filtered = activeCategory
    ? projects.filter((p) => p.categories?.includes(activeCategory))
    : projects;

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const selectCategory = (category: string | null) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  return (
    <div
      className="latest-portfolio-area custom-column-grid tmp-section-gapTop"
      id="portfolio"
    >
      <div className="container">
        <div className="section-head mb--60">
          <div className="section-sub-title center-title tmp-scroll-trigger tmp-fade-in animation-order-1">
            <span className="subtitle">{t("portfolio.subtitle")}</span>
          </div>
          <h2 className="title split-collab tmp-scroll-trigger tmp-fade-in animation-order-2">
            {t("portfolio.title_1")} <br />
            {t("portfolio.title_2")}
          </h2>
          <p className="description section-sm tmp-scroll-trigger tmp-fade-in animation-order-3">
            {t("portfolio.description")}
          </p>
        </div>

        {/* Category filter — only shown when projects define categories */}
        {!isLoading && allCategories.length > 1 && (
          <div className="project-filter-group mb--50" role="group" aria-label={t("portfolio.subtitle")}>
            <button
              className={`skill-filter-btn ${activeCategory === null ? "active" : ""}`}
              onClick={() => selectCategory(null)}
              aria-pressed={activeCategory === null}
            >
              {t("portfolio.filter_all")}
            </button>
            {allCategories.map((category) => (
              <button
                key={category}
                className={`skill-filter-btn ${activeCategory === category ? "active" : ""}`}
                onClick={() => selectCategory(category)}
                aria-pressed={activeCategory === category}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        <div className="row">
          {isLoading && Array.from({ length: 4 }).map((_, i) => (
            <div className="col-lg-6 col-sm-6" key={`skel-${i}`}>
              <div className="latest-portfolio-card" style={{ borderRadius: '20px', overflow: 'hidden', marginBottom: '30px' }}>
                <div className="skeleton-box" style={{ width: '100%', height: '400px', borderRadius: '20px' }} />
                <div style={{ padding: '20px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div className="skeleton-box" style={{ height: '20px', width: '60%' }} />
                  <div className="skeleton-box skeleton-box--soft" style={{ height: '14px', width: '80%' }} />
                </div>
              </div>
            </div>
          ))}

          {!isLoading && paginated.map((item, index) => (
            <div className="col-lg-6 col-sm-6" key={item.id}>
              <div
                className={`latest-portfolio-card tmp-hover-link tmp-scroll-trigger tmp-fade-in animation-order-${index + 1}`}
              >
                <div className="portfoli-card-img" style={{ padding: 0, overflow: 'hidden', borderRadius: '20px' }}>
                  <div className="img-box v2" style={{ borderRadius: 0 }}>
                    <Link
                      className="tmp-scroll-trigger tmp-zoom-in animation-order-1"
                      href={`/${locale}/project-details${isLight ? "-white" : ""}/${item.slug}`}
                      style={{ display: 'block', height: '100%' }}
                    >
                      <Image
                        alt={item.title}
                        src={item.imageUrl || "/assets/images/portfolio/portfolio-1.jpg"}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </Link>
                  </div>
                </div>
                <div className="portfolio-card-content-wrap">
                  <div className="content-left">
                    <h3 className="portfolio-card-title">
                      <Link
                        className="link"
                        href={`/${locale}/project-details${isLight ? "-white" : ""}/${item.slug}`}
                      >
                        {item.title}
                      </Link>
                    </h3>
                    <p className="portfoli-card-para">
                      {locale === "fr"
                        ? (item.summaryFr || item.descriptionFr)
                        : (item.summaryEn || item.descriptionEn)}
                    </p>
                    {item.tags?.length > 0 && (
                      <div className="tech-badge-list">
                        {item.tags.slice(0, MAX_BADGES).map((tag) => (
                          <span className="tech-badge" key={tag}>{tag}</span>
                        ))}
                        {item.tags.length > MAX_BADGES && (
                          <span className="tech-badge">+{item.tags.length - MAX_BADGES}</span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="portfolio-card-actions">
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="portfolio-demo-link"
                        aria-label={`${t("portfolio.view_demo")} — ${item.title}`}
                        title={t("portfolio.view_demo")}
                      >
                        <i className="fa-solid fa-globe" aria-hidden="true" />
                      </a>
                    )}
                    <Link
                      href={`/${locale}/project-details${isLight ? "-white" : ""}/${item.slug}`}
                      className="tmp-arrow-icon-btn"
                      aria-label={item.title}
                    >
                      <div className="btn-inner">
                        <i className="tmp-icon fa-solid fa-arrow-up-right" aria-hidden="true" />
                        <i className="tmp-icon-bottom fa-solid fa-arrow-up-right" aria-hidden="true" />
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {!isLoading && filtered.length === 0 && (
            <div className="col-lg-12 text-center">
              <p className="portfolio-empty">{t("portfolio.empty")}</p>
            </div>
          )}
        </div>

        {!isLoading && totalPages > 1 && (
          <div className="tmp-pagination-button mt--50">
            <button
              className="pagination-btn"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              style={{ opacity: currentPage === 1 ? 0.3 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontSize: '18px' }}
              aria-label="Page précédente / Previous page"
            >
              <i className="fa-solid fa-arrow-left" aria-hidden="true" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`pagination-btn${currentPage === page ? " active" : ""}`}
                onClick={() => goToPage(page)}
                style={{ cursor: 'pointer' }}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </button>
            ))}

            <button
              className="pagination-btn"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{ opacity: currentPage === totalPages ? 0.3 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontSize: '18px' }}
              aria-label="Page suivante / Next page"
            >
              <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
