"use client";

import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

interface Project {
  id: string;
  title: string;
  slug: string;
  summaryFr: string | null;
  summaryEn: string | null;
  descriptionFr: string | null;
  descriptionEn: string | null;
  imageUrl: string | null;
  displayOrder: number;
}

export default function Portfolio({ isLight = false }) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language || "fr";
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProjects(data);
        } else {
          console.error("Projects data is not an array:", data);
          setProjects([]);
        }
      })
      .catch((err) => console.error("Failed to fetch projects", err))
      .finally(() => setIsLoading(false));
  }, []);

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
        <div className="row">
          {projects.map((item, index) => (
            <div className="col-lg-6 col-sm-6" key={item.id}>
              <div
                className={`latest-portfolio-card tmp-hover-link tmp-scroll-trigger tmp-fade-in animation-order-${index + 1}`}
              >
                <div className="portfoli-card-img">
                  <div className="img-box v2">
                    <Link
                      className="tmp-scroll-trigger tmp-zoom-in animation-order-1"
                      href={`/${locale}/project-details${isLight ? "-white" : ""}/${item.slug}`}
                    >
                      <img
                        loading="lazy"
                        className="w-100"
                        alt={item.title}
                        src={item.imageUrl || "/assets/images/portfolio/portfolio-1.jpg"}
                        width={600}
                        height={400}
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
                  </div>
                  <Link
                    href={`/${locale}/project-details${isLight ? "-white" : ""}/${item.slug}`}
                    className="tmp-arrow-icon-btn"
                  >
                    <div className="btn-inner">
                      <i className="tmp-icon fa-solid fa-arrow-up-right" />
                      <i className="tmp-icon-bottom fa-solid fa-arrow-up-right" />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          ))}
          {!isLoading && projects.length === 0 && (
            <div className="col-lg-12 text-center">
              <p>Aucun projet à afficher pour le moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
